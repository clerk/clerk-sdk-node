// libs
import type { Request, Response, NextFunction } from 'express';
import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { jwtVerify } from 'jose/jwt/verify';
import type { JWTPayload } from 'jose/types.d';
import { importJWK } from 'jose/key/import';

// utils
import RestClient from './utils/RestClient';
import Logger from './utils/Logger';

// sub-apis
import { ClientApi } from './apis/ClientApi';
import { EmailApi } from './apis/EmailApi';
import { SessionApi } from './apis/SessionApi';
import { SMSMessageApi } from './apis/SMSMessageApi';
import { UserApi } from './apis/UserApi';

// resources
import { Session } from './resources/Session';

import { HttpError, ClerkServerError } from './utils/Errors';

const defaultApiKey = process.env.CLERK_API_KEY || '';
const defaultApiVersion = process.env.CLERK_API_VERSION || 'v1';
const defaultServerApiUrl = process.env.CLERK_API_URL || 'https://api.clerk.dev';

export type MiddlewareOptions = {
  onError?: Function;
};

export type WithSessionProp<T> = T & { session?: Session };
export type RequireSessionProp<T> = T & { session: Session };
export type WithSessionClaimsProp<T> = T & { sessionClaims?: object };
export type RequireSessionClaimsProp<T> = T & { sessionClaims: object };

export default class Clerk {
  private readonly _restClient: RestClient;
  private readonly _pubKey: string;

  // singleton instance
  static _instance: Clerk;

  // TODO we may not need to instantiate these any more if they keep no state
  // private api instances
  private _clientApi?: ClientApi;
  private _emailApi?: EmailApi;
  private _sessionApi?: SessionApi;
  private _smsMessageApi?: SMSMessageApi;
  private _userApi?: UserApi;

  constructor({
    apiKey = defaultApiKey,
    serverApiUrl = defaultServerApiUrl,
    apiVersion = defaultApiVersion,
    httpOptions = {},
  }: {
    apiKey?: string;
    serverApiUrl?: string;
    apiVersion?: string;
    httpOptions?: object;
  } = {}) {
    this._restClient = new RestClient(
      apiKey,
      serverApiUrl,
      apiVersion,
      httpOptions
    );
    const key = process.env.CLERK_PUBLIC_KEY
    if (!key) {
      throw new Error('Missing public key modulus (n)')
    }

    this._pubKey = key

    Logger.debug(this._pubKey)
  }

  // For use as singleton, always returns the same instance
  static getInstance(): Clerk {
    if (!this._instance) {
      this._instance = new Clerk();
    }

    return this._instance;
  }

  // Setters for the embedded rest client

  set apiKey(value: string) {
    this._restClient.apiKey = value;
  }

  set serverApiUrl(value: string) {
    this._restClient.serverApiUrl = value;
  }

  set apiVersion(value: string) {
    this._restClient.apiVersion = value;
  }

  set httpOptions(value: object) {
    this._restClient.httpOptions = value;
  }

  // Lazy sub-api getters

  get clients(): ClientApi {
    if (!this._clientApi) {
      this._clientApi = new ClientApi(this._restClient);
    }

    return this._clientApi;
  }

  get emails(): EmailApi {
    if (!this._emailApi) {
      this._emailApi = new EmailApi(this._restClient);
    }

    return this._emailApi;
  }

  get sessions(): SessionApi {
    if (!this._sessionApi) {
      this._sessionApi = new SessionApi(this._restClient);
    }

    return this._sessionApi;
  }

  get smsMessages(): SMSMessageApi {
    if (!this._smsMessageApi) {
      this._smsMessageApi = new SMSMessageApi(this._restClient);
    }

    return this._smsMessageApi;
  }

  get users(): UserApi {
    if (!this._userApi) {
      this._userApi = new UserApi(this._restClient);
    }

    return this._userApi;
  }

  // Utilities

  async verifyToken(token: string, algorithms: string[] = ['RS256']): Promise<JWTPayload> {
    const pubKey = await importJWK({
      use: 'sig',
      kty: 'RSA',
      e: 'AQAB',
      n: this._pubKey,
    }, 'RS256');

    const { payload } = await jwtVerify(token, pubKey, {algorithms: algorithms})

    if (!payload.iss || !(payload.iss?.lastIndexOf('https://clerk.', 0) === 0)) {
      throw new Error(`Invalid issuer: ${payload.iss}`)
    }

    return payload
  }

  // Middlewares

  // defaultOnError swallows the error
  defaultOnError(error: Error & { data: any }) {
    Logger.warn(error.message);

    (error.data || []).forEach((serverError: ClerkServerError) => {
      Logger.warn(serverError.longMessage);
    });
  }

  // strictOnError returns the error so that Express will halt the request chain
  strictOnError(error: Error & { data: any }) {
    Logger.error(error.message);

    (error.data || []).forEach((serverError: ClerkServerError) => {
      Logger.error(serverError.longMessage);
    });

    return error;
  }

  expressWithSession({ onError }: MiddlewareOptions = { onError: this.defaultOnError }): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    function verifyToken(clerk: Clerk, token: string):Promise<object> | undefined {
      try {
        return clerk.verifyToken(token)
      } catch(e) {
        return undefined
      }
    }

    async function authenticate(
      this: Clerk,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const cookies = new Cookies(req, res);

      try {
        const cookieToken = cookies.get('__session');
        Logger.debug(`cookieToken: ${cookieToken}`);

        let headerToken;
        if (req.headers) {
          headerToken = (req.headers['Authorization'] || req.headers['authorization']) as string
          Logger.debug(`headerToken: ${headerToken}`);
        }

        let sessionClaims;

        if (headerToken) {
          sessionClaims = await verifyToken(this, headerToken);
        }

        // Try to verify token from cookie only if header is empty or failed to verify
        if (!sessionClaims && cookieToken) {
          sessionClaims = await verifyToken(this, cookieToken);
        }

        if (!sessionClaims) {
          throw new HttpError(401, 'Missing session token', undefined)
        }

        // Set Clerk session claims on request
        // TBD Set on state / locals instead?
        // @ts-ignore
        req.sessionClaims = sessionClaims;

        // @ts-ignore
        req.session = new Session({id: sessionClaims.sid, userId: sessionClaims.sub})

        next();
      } catch (error) {
        // Session will not be set on request

        // Call onError if provided
        if (!onError) {
          return next();
        }

        const err = await onError(error);

        if (err) {
          next(err);
        } else {
          next();
        }
      }
    }

    return authenticate.bind(this);
  }

  expressRequireSession({ onError }: MiddlewareOptions = { onError: this.strictOnError }) {
    return this.expressWithSession({ onError });
  }

  // Credits to https://nextjs.org/docs/api-routes/api-middlewares
  // Helper method to wait for a middleware to execute before continuing
  // And to throw an error when an error happens in a middleware
  // @ts-ignore
  private _runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }

        return resolve(result);
      });
    });
  }

  // Set the session on the request and then call provided handler
  withSession(handler: Function, { onError }: MiddlewareOptions = { onError: this.defaultOnError }) {
    return async (
      req: WithSessionProp<NextApiRequest> | WithSessionClaimsProp<NextApiRequest>,
      res: NextApiResponse
    ) => {
      try {
        await this._runMiddleware(req, res, this.expressWithSession({ onError }));
        return handler(req, res);
      } catch (error) {
        // @ts-ignore
        res.statusCode = error.statusCode || 401;
        // @ts-ignore
        res.json(error.data || { error: error.message });
        res.end();
      }
    };
  }

  // Stricter version, short-circuits if session can't be determined
  requireSession(handler: Function, { onError }: MiddlewareOptions = { onError: this.strictOnError }) {
    return this.withSession(handler, { onError })
  }
}

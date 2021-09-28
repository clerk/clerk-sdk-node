// libs
import type { Request, Response, NextFunction } from 'express';
import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwks, { JwksClient } from 'jwks-rsa';

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
const defaultJWKSCacheMaxAge = 3600000 // 1 hour

export type MiddlewareOptions = {
  onError?: Function;
};

export type WithSessionProp<T> = T & { session?: Session };
export type RequireSessionProp<T> = T & { session: Session };
export type WithSessionClaimsProp<T> = T & { sessionClaims?: JwtPayload };
export type RequireSessionClaimsProp<T> = T & { sessionClaims: JwtPayload };

export default class Clerk {
  private _restClient: RestClient;
  private _jwksClient: JwksClient;

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
    jwksCacheMaxAge = defaultJWKSCacheMaxAge,
  }: {
    apiKey?: string;
    serverApiUrl?: string;
    apiVersion?: string;
    httpOptions?: object;
    jwksCacheMaxAge?: number;
  } = {}) {
    this._restClient = new RestClient(
      apiKey,
      serverApiUrl,
      apiVersion,
      httpOptions
    );

    this._jwksClient = jwks({
      jwksUri: `${serverApiUrl}/${apiVersion}/jwks`,
      requestHeaders: {
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 5000,
      cache: true,
      cacheMaxAge: jwksCacheMaxAge,
    });
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

  decodeToken(token: string): JwtPayload {
    const decoded = jwt.decode(token)
    if (!decoded) {
      throw new Error(`Failed to decode token: ${token}`)
    }

    return decoded as JwtPayload
  }

  async verifyToken(token: string, algorithms: string[] = ['RS256']): Promise<JwtPayload> {
    const decoded = jwt.decode(token, { complete: true })
    if (!decoded) {
      throw new Error(`Failed to verify token: ${token}`)
    }

    const key = await this._jwksClient.getSigningKey(decoded.header.kid)
    const verified = jwt.verify(token, key.getPublicKey(), {algorithms: algorithms as jwt.Algorithm[]}) as JwtPayload

    if (!verified.hasOwnProperty('iss') || !(verified.iss?.lastIndexOf('https://clerk.', 0) === 0)) {
        throw new Error(`Invalid issuer: ${verified.iss}`)
      }

    return verified
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
    function isAuthV2Request(clerk: Clerk, token: string | undefined): boolean {
      try {
        if (!token) {
          return false
        }

        const decoded = clerk.decodeToken(token)
        return (decoded.iss?.lastIndexOf('https://clerk.', 0) === 0)
      } catch (e) {
        return false
      }
    }

    function verifyToken(clerk: Clerk, token: string):Promise<JwtPayload> | undefined {
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

        if (isAuthV2Request(this, headerToken) || isAuthV2Request(this, cookieToken)) {
          // Set Clerk session claims on request
          // TBD Set on state / locals instead?
          // @ts-ignore
          req.sessionClaims = await verifyToken(this, headerToken || cookieToken);

          next();
        } else {
          if (!cookieToken) {
            throw new HttpError(401, 'No session cookie found', undefined)
          }

          let sessionId: any = req.query._clerk_session_id;

          Logger.debug(`sessionId from query: ${sessionId}`);

          let session: (Session | undefined) = undefined;
          if (!sessionId) {
            const client = await this.clients.verifyClient(cookieToken);
            session = client.sessions.find(session => session.id === client.lastActiveSessionId);
            Logger.debug(`active session from client ${client.id}: ${session?.id}`);
          } else {
            session = await this.sessions.verifySession(
                sessionId,
                cookieToken
            );
            Logger.debug(`active session from session id ${sessionId}: ${session}`);
          }

          // Set Clerk session on request
          // TBD Set on state / locals instead?
          // @ts-ignore
          req.session = session;

          next();
        }
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
        res.statusCode = error.statusCode || 401;
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

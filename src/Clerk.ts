// libs
import type { Request, Response, NextFunction } from 'express';
import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

// utils
import RestClient from './utils/RestClient';
import Logger from './utils/Logger';

// sub-apis
import { ClientApi } from './apis/ClientApi';
import { EmailApi } from './apis/EmailApi';
import { JWKSApi } from './apis/JWKSApi';
import { SessionApi } from './apis/SessionApi';
import { SMSMessageApi } from './apis/SMSMessageApi';
import { UserApi } from './apis/UserApi';

// resources
import { Session } from './resources/Session';

import { HttpError, ClerkServerError } from './utils/Errors';

const defaultApiKey = process.env.CLERK_API_KEY || '';
const defaultApiVersion = process.env.CLERK_API_VERSION || 'v1';
const defaultServerApiUrl =
  process.env.CLERK_API_URL || 'https://api.clerk.dev';

export type MiddlewareOptions = {
  onError?: Function;
};

export type WithSessionProp<T> = T & { session?: Session };
export type RequireSessionProp<T> = T & { session: Session };

export default class Clerk {
  private _restClient: RestClient;

  // singleton instance
  static _instance: Clerk;

  // TODO we may not need to instantiate these any more if they keep no state
  // private api instances
  private _clientApi?: ClientApi;
  private _emailApi?: EmailApi;
  private _jwksApi?: JWKSApi;
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

  get jwks(): JWKSApi {
    if (!this._jwksApi) {
      this._jwksApi = new JWKSApi(this._restClient);
    }

    return this._jwksApi;
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
    async function authenticate(
      this: Clerk,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const cookies = new Cookies(req, res);

      try {
        const sessionToken = cookies.get('__session');

        Logger.debug(`sessionToken: ${sessionToken}`);

        if (!sessionToken) {
          throw new HttpError(401, 'No session cookie found', undefined)
        }

        let sessionId: any = req.query._clerk_session_id;

        Logger.debug(`sessionId from query: ${sessionId}`);

        let session: (Session | undefined) = undefined;
        if (!sessionId) {
          const client = await this.clients.verifyClient(sessionToken);
          session = client.sessions.find(session => session.id === client.lastActiveSessionId);
          Logger.debug(`active session from client ${client.id}: ${session?.id}`);
        } else {
          session = await this.sessions.verifySession(
              sessionId,
              sessionToken
          );
          Logger.debug(`active session from session id ${sessionId}: ${session}`);
        }

        // Set Clerk session on request
        // TBD Set on state / locals instead?
        // @ts-ignore
        req.session = session;

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
      req: WithSessionProp<NextApiRequest>,
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

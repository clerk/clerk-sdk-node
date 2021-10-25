// libs
import type { Request, Response, NextFunction } from 'express';
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

import { ClerkServerError } from './utils/Errors';

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
    function decodeToken(clerk: Clerk, token: string):JwtPayload | undefined {
      try {
        return clerk.decodeToken(token)
      } catch(e) {
        return undefined
      }
    }

    function verifyToken(clerk: Clerk, token: string | undefined):Promise<JwtPayload> | undefined {
      if (!token) {
        return undefined;
      }

      try {
        return clerk.verifyToken(token)
      } catch(e) {
        return undefined
      }
    }

    function isDevelopmentOrStaging(apiKey: string): boolean {
      return apiKey.startsWith('test_')
    }

    function isProduction(apiKey: string): boolean {
      return !isDevelopmentOrStaging(apiKey)
    }

    function isCrossOriginRequest(req: Request): boolean {
      // Remove request's protocol
      const origin = req.headers.origin?.trim().replace(/(^\w+:|^)\/\//, '');
      if (!origin) {
        return false;
      }

      let initialHost = req.headers.host as string;
      // Need to append the protocol if not exists for URL parse to work correctly
      if (!initialHost.startsWith('http://') && !initialHost.startsWith('https://')) {
        initialHost = `https://${initialHost}`;
      }

      const hostURL = new URL(initialHost);

      let host = (req.headers['X-Forwarded-Host'] as string)?.trim();
      if (!host) {
        host = hostURL.hostname;
      }

      let port = (req.headers['X-Forwarded-Port'] as string)?.trim();
      if (!port) {
        port = hostURL.port;
      }

      if (port && port !== '80' && port !== '443') {
        host = `${host}:${port}`;
      }

      return origin !== host;
    }

    function signedOut() {
      throw new Error('Unauthenticated')
    }

    async function interstitial(res: Response, restClient: RestClient) {
      const body = await restClient.makeRequest({
        method: 'get',
        path: '/internal/interstitial',
        responseType: 'text',
      })

      res.writeHead(401, { 'Content-Type': 'text/html'})
      res.write(body)
      res.end();
    }

    async function authenticate(
        this: Clerk,
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
      const cookies = new Cookies(req, res);

      try {
        const cookieToken = cookies.get('__session');
        Logger.debug(`cookieToken: ${cookieToken}`);
        const clientUat = cookies.get('__client_uat');
        Logger.debug(`clientUat: ${clientUat}`);
        let headerToken = (req.headers['Authorization'] || req.headers['authorization']) as string;
        headerToken = headerToken?.replace('Bearer ', '');
        Logger.debug(`headerToken: ${headerToken}`);

        // HEADER AUTHENTICATION
        if (headerToken && !decodeToken(this, headerToken)) {
          return signedOut();
        }

        if (!headerToken && isCrossOriginRequest(req)) {
          return signedOut();
        }

        if (headerToken) {
          const sessionClaims = await verifyToken(this, headerToken)
          if (!sessionClaims) {
            return res.status(401).end();
          }

          // @ts-ignore
          req.sessionClaims = sessionClaims;
          // @ts-ignore
          req.session = new Session({id: sessionClaims.sid, userId: sessionClaims.sub});
          return next();
        }

        // COOKIE AUTHENTICATION
        if (isDevelopmentOrStaging(this._restClient.apiKey) && (!req.headers.referer || isCrossOriginRequest(req))) {
          await interstitial(res, this._restClient);
          return;
        }

        if (isProduction(this._restClient.apiKey) && !clientUat) {
          return signedOut();
        }

        if (clientUat === '0') {
          return signedOut();
        }

        const sessionClaims = await verifyToken(this, cookieToken);

        if (cookieToken && clientUat && sessionClaims?.iat && sessionClaims.iat >= Number(clientUat)) {
          // @ts-ignore
          req.sessionClaims = sessionClaims;
          // @ts-ignore
          req.session = new Session({id: sessionClaims.sid, userId: sessionClaims.sub});
          return next();
        }

        await interstitial(res, this._restClient);
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
      req: WithSessionProp<Request> | WithSessionClaimsProp<Request>,
      res: Response
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

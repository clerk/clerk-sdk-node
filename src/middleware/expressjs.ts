import type { Request, Response, NextFunction } from 'express';
import Cookies from 'cookies';
import Clerk from '../Clerk';

export type MiddlewareOptions = {
  serverApiUrl?: string;
  onError?: Function;
};

export default function ExpressAuthMiddleware(
  apiKey: string,
  options: MiddlewareOptions
) {
  return async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const cookies = new Cookies(req, res);
    let client;

    try {
      const clerk = new Clerk(apiKey, { serverApiUrl: options.serverApiUrl });
      const sessionToken = String(cookies.get('__session'));

      if (!sessionToken) {
        throw new Error('No session cookie found');
      }

      let sessionId: any = req.query._clerk_session_id;

      console.log(`sessionId from query: ${sessionId}`);

      if (!sessionId) {
        client = await clerk.clientApi.verifyClient(sessionToken);
        sessionId = client.lastActiveSessionId;
        console.log(`sessionId from client: ${sessionId}`);
      }

      const session = await clerk.sessionApi.verifySession(
        sessionId,
        sessionToken
      );

      // Set Clerk session on request
      // TBD Set on state / locals instead?
      // @ts-ignore
      req.session = session;

      next();
    } catch (error) {
      // Don't set session on request
      // TODO add different handling depending on wrong api key vs unauthenticated user

      // Call onError if provided
      if (options.onError) {
        await options.onError(error);
      }

      next();
    }
  };
}

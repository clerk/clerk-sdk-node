import type { Request, Response, NextFunction } from 'express';
import Cookies from 'cookies';
import Clerk from '../Clerk';
import Logger from '../utils/Logger'

export type MiddlewareOptions = {
  clerk: Clerk,
  onError?: Function
}

export default function ClerkExpressMiddleware({ clerk, onError }: MiddlewareOptions) {
  return async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const cookies = new Cookies(req, res);
    let client;

    try {
      const sessionToken = String(cookies.get('__session'));

      if (!sessionToken) {
        throw new Error('No session cookie found');
      }

      let sessionId: any = req.query._clerk_session_id;

      Logger.info(`sessionId from query: ${sessionId}`);

      if (!sessionId) {
        client = await clerk.clients.verifyClient(sessionToken);
        sessionId = client.lastActiveSessionId;
        Logger.info(`sessionId from client: ${sessionId}`);
      }

      const session = await clerk.sessions.verifySession(
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
      if (onError) {
        await onError(error);
      }

      next();
    }
  };
}

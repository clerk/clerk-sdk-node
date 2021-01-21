import type { NextApiRequest, NextApiResponse } from 'next';
import ClerkExpressMiddleware, { MiddlewareOptions } from './expressjs';
import { Session } from '../resources/Session';

export type WithSessionProp<T> = T & { session?: Session };
export type RequireSessionProp<T> = T & { session: Session };

// Credits to https://nextjs.org/docs/api-routes/api-middlewares
// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
// @ts-ignore
function runMiddleware(req, res, fn) {
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

// Set the session on the request and the call provided handler
export function withSession(
  handler: Function,
  options: MiddlewareOptions = { serverApiUrl: process.env.CLERK_API_URL }
) {
  return async (req: WithSessionProp<NextApiRequest>, res: NextApiResponse) => {
    await runMiddleware(
      req,
      res,
      ClerkExpressMiddleware(process.env.CLERK_API_KEY || '', options)
    );

    return handler(req, res);
  };
}

// Stricter version, short-circuits if no session is present
export function requireSession(
  handler: Function,
  options: MiddlewareOptions = { serverApiUrl: process.env.CLERK_API_URL }
) {
  return async (
    req: RequireSessionProp<NextApiRequest>,
    res: NextApiResponse
  ) => {
    await runMiddleware(
      req,
      res,
      ClerkExpressMiddleware(process.env.CLERK_API_KEY || '', options)
    );

    if (req.session) {
      return handler(req, res);
    } else {
      res.statusCode = 401;
      res.end();
    }
  };
}

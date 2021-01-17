import type { NextApiRequest, NextApiResponse } from 'next';
import ExpressAuthMiddleware, { MiddlewareOptions } from './expressjs';
import { Session } from '../resources/Session';

export type WithSessionProp<T> = T & { session?: Session }
export type RequireSessionProp<T> = T & { session: Session }

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(middleware: Function) {
  // @ts-ignore
  return (req, res) =>
    new Promise((resolve, reject) => {
      // @ts-ignore
      middleware((req, res, result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

// Set the session on the request and the call provided handler
export function withSession(handler: Function, options: MiddlewareOptions = { serverApiUrl: process.env.CLERK_API_URL }) {
  return async (req: WithSessionProp<NextApiRequest>, res: NextApiResponse) => {
    await runMiddleware(ExpressAuthMiddleware(process.env.CLERK_API_KEY || '', options));
    
    return handler(req, res);
  }
}

// Stricter version, fails fast if no session is present
export function requireSession(handler: Function, options: MiddlewareOptions = { serverApiUrl: process.env.CLERK_API_URL }) {
  return async (req: RequireSessionProp<NextApiRequest>, res: NextApiResponse) => {
    await runMiddleware(ExpressAuthMiddleware(process.env.CLERK_API_KEY || '', options));

    if (req.session) {
      res.statusCode = 401;
      res.end();
    } else {
      return handler(req, res);
    }  
  }
}

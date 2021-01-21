import Clerk from './Clerk';
import ClerkExpressMiddleware from './middleware/expressjs';
import {
  withSession,
  requireSession,
  WithSessionProp,
  RequireSessionProp,
} from './middleware/nextjs';

export default Clerk;
export {
  ClerkExpressMiddleware,
  withSession,
  requireSession,
  WithSessionProp,
  RequireSessionProp,
};

import Clerk from './Clerk';
import ExpressAuthMiddleware from './middleware/expressjs';
import {
  withSession,
  requireSession,
  WithSessionProp,
  RequireSessionProp,
} from './middleware/nextjs';

export default Clerk;
export {
  ExpressAuthMiddleware,
  withSession,
  requireSession,
  WithSessionProp,
  RequireSessionProp,
};

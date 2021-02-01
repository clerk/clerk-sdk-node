import Clerk from './Clerk';

import ClerkExpressMiddleware from './middleware/expressjs';
export { ClerkExpressMiddleware };

export {
  withSession,
  requireSession,
  WithSessionProp,
  RequireSessionProp,
} from './middleware/nextjs';

export default Clerk;

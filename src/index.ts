import Clerk from './instance';

// Export as a named export in case the dev wishes to create Clerk instances as well
export { Clerk };

export {
  ClerkExpressMiddleware,
  withSession,
  requireSession,
  WithSessionProp,
  RequireSessionProp,
} from './instance';

const singletonInstance = Clerk.getInstance();
const clients = singletonInstance.clients;
const emails = singletonInstance.emails;
const sessions = singletonInstance.sessions;
const smsMessages = singletonInstance.smsMessages;
const users = singletonInstance.users;

// Export a default singleton instance that should suffice for most use cases
export default singletonInstance;

// Export sub-api objects
export { clients, emails, sessions, smsMessages, users };

// Export setters for the default singleton instance
// Useful if you de-structure the default export and have access only to a sub-api instance

export function setClerkApiKey(value: string) {
  Clerk.getInstance().apiKey = value;
}

export function setClerkServerApiUrl(value: string) {
  Clerk.getInstance().serverApiUrl = value;
}

export function setClerkApiVersion(value: string) {
  Clerk.getInstance().apiVersion = value;
}

export function setClerkHttpOptions(value: object) {
  Clerk.getInstance().httpOptions = value;
}

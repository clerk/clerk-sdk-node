import Clerk from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const serverApiUrl = process.env.CLERK_API_URL;
const apiKey = process.env.CLERK_API_KEY;
const clientId = process.env.CLIENT_ID;
const userId = process.env.USER_ID;
const sessionId = process.env.SESSION_ID;
const sessionIdtoRevoke = process.env.SESSION_ID_TO_REVOKE;
const sessionToken = process.env.SESSION_TOKEN;

const clerk = new Clerk.default(apiKey, { serverApiUrl });

console.log('Get session list');
let sessions = await clerk.sessionApi.getSessionList();
console.log(sessions);

console.log('Get session list filtered by userId');
let filteredSessions1 = await clerk.sessionApi.getSessionList({ userId });
console.log(filteredSessions1);

console.log('Get session list filtered by clientId');
let filteredSessions2 = await clerk.sessionApi.getSessionList({ clientId });
console.log(filteredSessions2);

console.log('Get single session');
let session = await clerk.sessionApi.getSession(sessionId);
console.log(session);

console.log('Revoke session');
let revokedSession = await clerk.sessionApi.revokeSession(sessionIdtoRevoke);
console.log(revokedSession);

console.log('Verify session');
let verifiedSession = await clerk.clientApi.verifySession(
  sessionId,
  sessionToken
);
console.log(verifiedSession);

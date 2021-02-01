// Usage:
// node --require dotenv/config session.mjs

import { setClerkServerApiUrl, sessions } from '@clerk/clerk-sdk-node';

const serverApiUrl = process.env.CLERK_API_URL;
const clientId = process.env.CLIENT_ID;
const userId = process.env.USER_ID;
const sessionId = process.env.SESSION_ID;
const sessionIdtoRevoke = process.env.SESSION_ID_TO_REVOKE;
const sessionToken = process.env.SESSION_TOKEN;

setClerkServerApiUrl(serverApiUrl);

console.log('Get session list');
let sessionList = await sessions.getSessionList();
console.log(sessionList);

console.log('Get session list filtered by userId');
let filteredSessions1 = await sessions.getSessionList({ userId });
console.log(filteredSessions1);

console.log('Get session list filtered by clientId');
let filteredSessions2 = await sessions.getSessionList({ clientId });
console.log(filteredSessions2);

console.log('Get single session');
let session = await sessions.getSession(sessionId);
console.log(session);

console.log('Revoke session');
let revokedSession = await sessions.revokeSession(sessionIdtoRevoke);
console.log(revokedSession);

console.log('Verify session');
let verifiedSession = await sessions.verifySession(
  sessionId,
  sessionToken
);
console.log(verifiedSession);

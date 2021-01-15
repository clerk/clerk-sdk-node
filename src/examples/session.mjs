import { ClerkServerSDK } from 'clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.BASE_URL
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;
const userId = process.env.USER_ID;
const sessionId = process.env.SESSION_ID;
const sessionIdtoRevoke = process.env.SESSION_ID_TO_REVOKE;

const sdk = new ClerkServerSDK(accessToken, { baseUrl: baseUrl });

console.log('Get session list');
let sessions = await sdk.sessionApi.getSessionList();
console.log(JSON.stringify(sessions));

console.log('Get session list filtered by userId');
let filteredSessions1 = await sdk.sessionApi.getSessionList({ userId });
console.log(JSON.stringify(filteredSessions1));

console.log('Get session list filtered by clientId');
let filteredSessions2 = await sdk.sessionApi.getSessionList({ clientId });
console.log(JSON.stringify(filteredSessions2));

console.log('Get single session');
let session = await sdk.sessionApi.getSession(sessionId);
console.log(JSON.stringify(session));

console.log('Revoke session');
let revokedSession = await sdk.sessionApi.revokeSession(sessionIdtoRevoke);
console.log(JSON.stringify(revokedSession));

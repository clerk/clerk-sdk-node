import Clerk from 'clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.BASE_URL
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;
const sessionToken = process.env.SESSION_TOKEN;

const clerk = new Clerk.default(accessToken, { baseUrl: baseUrl });

console.log('Get client list');
let clients = await clerk.clientApi.getClientList();
console.log(clients);

console.log('Get single client');
let client = await clerk.clientApi.getClient(clientId);
console.log(client);

console.log('Verify client');
let verifiedClient = await clerk.clientApi.verifyClient(sessionToken);
console.log(verifiedClient);

try {
  console.log('Get single client for invalid clientId');
  let invalidClient = await clerk.clientApi.getClient('foobar');
  console.log(invalidClient);
} catch(error) {
  console.log(error);
}

try {
  console.log('Get client list with invalid API key');
  const clerk2 = new Clerk('snafu', { baseUrl: baseUrl });
  let invalidClients = await clerk2.clientApi.getClientList();
  console.log(invalidClients);
} catch(error) {
  console.log(error);
}

import { ClerkServerSDK } from 'clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.BASE_URL
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;

const sdk = new ClerkServerSDK(accessToken, { baseUrl: baseUrl });

console.log('Get client list');
let clients = await sdk.clientApi.getClientList();
console.log(JSON.stringify(clients));

console.log('Get single client');
let client = await sdk.clientApi.getClient(clientId);
console.log(JSON.stringify(client));

// TODO authenticate

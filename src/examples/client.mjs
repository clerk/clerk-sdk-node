import { ClerkServerSDK } from 'clerk_server_sdk_node';
import dotenv from 'dotenv';

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;

const sdk = new ClerkServerSDK(accessToken);

console.log('Get client list');
let clients = await sdk.clientApi.getClientList();
console.log(JSON.stringify(clients));

console.log('Get single client');
let client = await sdk.clientApi.getClient(clientId);
console.log(JSON.stringify(client));

// TODO authenticate

import { ClerkServerSDK } from 'clerk_server_sdk_node';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.BASE_URL
const accessToken = process.env.ACCESS_TOKEN;
const emailAddressId = process.env.EMAIL_ADDRESS_ID;

const sdk = new ClerkServerSDK(accessToken, { baseUrl: baseUrl });

console.log('Create email');
const fromEmailName = 'sales';
const subject = 'Amazing offer!';
const body = 'Click <a href="https://www.thisiswhyimbroke.com/">here</a> to find out more!';
let email = await sdk.emailApi.createEmail({ fromEmailName, subject, body, emailAddressId });
console.log(JSON.stringify(email));

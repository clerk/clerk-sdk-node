import Clerk from 'clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const serverApiUrl = process.env.SERVER_API_URL
const apiKey = process.env.API_KEY;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

const clerk = new Clerk.default(apiKey, { serverApiUrl });

console.log('Create SMS message');
const message = "I'd buy that for a dollar";
let smsMessage = await clerk.smsMessageApi.createSMSMessage({ message, phoneNumberId });
console.log(smsMessage);

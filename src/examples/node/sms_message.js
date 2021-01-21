const Clerk = require('@clerk/clerk-sdk-node');
require('dotenv').config();

const serverApiUrl = process.env.CLERK_API_URL;
const apiKey = process.env.CLERK_API_KEY;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

const clerk = new Clerk.default(apiKey, { serverApiUrl });

console.log('Create SMS message');
const message = "I'd buy that for a dollar";
clerk.smsMessageApi
  .createSMSMessage({ message, phoneNumberId })
  .then(smsMessage => console.log(smsMessage));

const Clerk = require('clerk-sdk-node');
require('dotenv').config();

const baseUrl = process.env.BASE_URL
const accessToken = process.env.ACCESS_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

const clerk = new Clerk.default(accessToken, { baseUrl: baseUrl });

console.log('Create SMS message');
const message = "I'd buy that for a dollar";
clerk.smsMessageApi.createSMSMessage({ message, phoneNumberId }).then(smsMessage => console.log(smsMessage));

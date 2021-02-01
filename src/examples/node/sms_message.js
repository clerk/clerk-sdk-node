// Usage:
// node --require dotenv/config sms_message.js

// This doesn't work yet, tsdx doesn't seem to support multi-entry properly
// const Clerk = require('@clerk/clerk-sdk-node/instance');

const pkg = require('@clerk/clerk-sdk-node');
const { Clerk } = pkg;

const serverApiUrl = process.env.CLERK_API_URL;
const apiKey = process.env.CLERK_API_KEY;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

const clerk = new Clerk({ apiKey, serverApiUrl });

console.log('Create SMS message');
const message = "I'd buy that for a dollar";
clerk.smsMessages
  .createSMSMessage({ message, phoneNumberId })
  .then(smsMessage => console.log(smsMessage));

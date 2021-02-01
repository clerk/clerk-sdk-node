// Usage:
// node --require dotenv/config sms_message.mjs

import { smsMessages, setClerkServerApiUrl } from '@clerk/clerk-sdk-node';

const serverApiUrl = process.env.CLERK_API_URL;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

setClerkServerApiUrl(serverApiUrl);

console.log('Create SMS message');
const message = "I'd buy that for a dollar";
let smsMessage = await smsMessages.createSMSMessage({
  message,
  phoneNumberId,
});
console.log(smsMessage);

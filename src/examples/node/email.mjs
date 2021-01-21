import Clerk from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const serverApiUrl = process.env.CLERK_API_URL;
const apiKey = process.env.CLERK_API_KEY;
const emailAddressId = process.env.EMAIL_ADDRESS_ID;

console.log('API KEY:');
console.log(apiKey);

console.log('URL:');
console.log(serverApiUrl);

const clerk = new Clerk.default(apiKey, { serverApiUrl });

console.log('Create email');
const fromEmailName = 'sales';
const subject = 'Amazing offer!';
const body =
  'Click <a href="https://www.thisiswhyimbroke.com/">here</a> to find out more!';
let email = await clerk.emailApi.createEmail({
  fromEmailName,
  subject,
  body,
  emailAddressId,
});
console.log(email);

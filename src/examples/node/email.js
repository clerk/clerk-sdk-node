const Clerk = require('@clerk/clerk-sdk-node');
require('dotenv').config();

const serverApiUrl = process.env.CLERK_API_URL;
const apiKey = process.env.CLERK_API_KEY;
const emailAddressId = process.env.EMAIL_ADDRESS_ID;

const clerk = new Clerk.default(apiKey, { serverApiUrl });

console.log('Create email');
const fromEmailName = 'sales';
const subject = 'Amazing offer!';
const body =
  'Click <a href="https://www.thisiswhyimbroke.com/">here</a> to find out more!';

clerk.emailApi
  .createEmail({ fromEmailName, subject, body, emailAddressId })
  .then(email => console.log(email));

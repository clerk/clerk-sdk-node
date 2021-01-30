// Usage:
// node --require dotenv/config email.js

// This doesn't work yet, tsdx doesn't seem to support multi-entry properly
// const Clerk = require('@clerk/clerk-sdk-node/instance');

const pkg = require('@clerk/clerk-sdk-node');
const { Clerk } = pkg;

const serverApiUrl = process.env.CLERK_API_URL;
const apiKey = process.env.CLERK_API_KEY;
const emailAddressId = process.env.EMAIL_ADDRESS_ID;

const clerk = new Clerk({ apiKey, serverApiUrl });

console.log('Create email');
const fromEmailName = 'sales';
const subject = 'Amazing offer!';
const body =
  'Click <a href="https://www.thisiswhyimbroke.com/">here</a> to find out more!';

clerk.emails
  .createEmail({ fromEmailName, subject, body, emailAddressId })
  .then(email => console.log(email));

// Usage:
// From examples/node, transpile files by running `tsc`
// To run:
// node --require dotenv/config dist/emails.js

import { setClerkServerApiUrl, emails } from '@clerk/clerk-sdk-node';

const serverApiUrl = process.env.CLERK_API_URL || '';
const emailAddressId = process.env.EMAIL_ADDRESS_ID || '';

setClerkServerApiUrl(serverApiUrl);

console.log('Create email');

const fromEmailName = 'sales';
const subject = 'Amazing offer!';
const body =
  'Click <a href="https://www.thisiswhyimbroke.com/">here</a> to find out more!';

try {
  let email = await emails.createEmail({
    fromEmailName,
    subject,
    body,
    emailAddressId,
  });

  console.log(email);
} catch (error) {
  console.log(error);
}

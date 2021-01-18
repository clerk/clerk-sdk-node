const Clerk = require('clerk-sdk-node');
require('dotenv').config();

const baseUrl = process.env.BASE_URL
const accessToken = process.env.ACCESS_TOKEN;
const emailAddressId = process.env.EMAIL_ADDRESS_ID;

const clerk = new Clerk.default(accessToken, { baseUrl: baseUrl });

console.log('Create email');
const fromEmailName = 'sales';
const subject = 'Amazing offer!';
const body = 'Click <a href="https://www.thisiswhyimbroke.com/">here</a> to find out more!';

clerk.emailApi.createEmail({ fromEmailName, subject, body, emailAddressId }).then(email => console.log(email));

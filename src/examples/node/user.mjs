// Usage:
// node --require dotenv/config user.mjs

import { setClerkServerApiUrl, users } from '@clerk/clerk-sdk-node';

const userId = process.env.USER_ID;
const userIdToDelete = process.env.USER_ID_TO_DELETE;

setClerkServerApiUrl(process.env.CLERK_API_URL);

console.log(`apiKey in consumer ${process.env.CLERK_API_KEY}`);

console.log('Get user list');
let userList = await users.getUserList();
console.log(userList);

console.log('Get single user');
let user = await users.getUser(userId);
console.log(user);

console.log('Update user');
let updatedUser = await users.updateUser(userId, {
  firstName: 'Kyle',
  lastName: 'Reese',
});
// let updatedUser = await sdk.userApi.updateUser(userId, { firstName: 'John', lastName: 'Connor' });
// let updatedUser = await sdk.userApi.updateUser(userId, { firstName: 'Peter', lastName: 'Silberman' });
console.log(updatedUser);

console.log('Delete user');
let deletedUser = await users.deleteUser(userIdToDelete);
console.log(deletedUser);

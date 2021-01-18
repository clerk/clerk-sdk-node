import { Clerk } from 'clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.BASE_URL
const accessToken = process.env.ACCESS_TOKEN;
const userId = process.env.USER_ID;
const userIdToDelete = process.env.USER_ID_TO_DELETE;

const clerk = new Clerk(accessToken, { baseUrl: baseUrl });

console.log('Get user list');
let users = await clerk.userApi.getUserList();
console.log(JSON.stringify(users));

console.log('Get single user');
let user = await clerk.userApi.getUser(userId);
console.log(JSON.stringify(user));

console.log('Update user');
let updatedUser = await clerk.userApi.updateUser(userId, { firstName: 'Kyle', lastName: 'Reese' });
// let updatedUser = await sdk.userApi.updateUser(userId, { firstName: 'John', lastName: 'Connor' });
// let updatedUser = await sdk.userApi.updateUser(userId, { firstName: 'Peter', lastName: 'Silberman' });
console.log(JSON.stringify(updatedUser));

console.log('Delete user');
let deletedUser = await clerk.userApi.deleteUser(userIdToDelete);
console.log(JSON.stringify(deletedUser));

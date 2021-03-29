import nock from 'nock';
import { users, User } from '../../index';

test('getUserList() returns a list of users', async () => {
  nock('https://api.clerk.dev')
    .get('/v1/users')
    .replyWithFile(200, __dirname + '/responses/getUserList.json', {
      'Content-Type': 'application/x-www-form-urlencoded',
    });

  const userList = await users.getUserList();

  expect(userList).toBeInstanceOf(Array);
  expect(userList.length).toEqual(1);

  // const expected = new User();

  // expect(userList[0]).toEqual(expected);

  expect(userList[0]).toBeInstanceOf(User);
});

test('getUserList() with limit returns a list of users', async () => {
  nock('https://api.clerk.dev')
    .get('/v1/users?limit=1')
    .replyWithFile(200, __dirname + '/responses/getUserList.json', {
      'Content-Type': 'application/x-www-form-urlencoded',
    });

  const userList = await users.getUserList({limit: 1});

  expect(userList).toBeInstanceOf(Array);
  expect(userList.length).toEqual(1);

  // const expected = new User();

  // expect(userList[0]).toEqual(expected);

  expect(userList[0]).toBeInstanceOf(User);
});

test('getUserList() with limit returns a list of users', async () => {
  nock('https://api.clerk.dev')
    .get('/v1/users?limit=1&offset=1')
    .replyWithFile(200, __dirname + '/responses/getUserList.json', {
      'Content-Type': 'application/x-www-form-urlencoded',
    });

  const userList = await users.getUserList({limit: 1, offset: 1});

  expect(userList).toBeInstanceOf(Array);
  expect(userList.length).toEqual(1);

  // const expected = new User();

  // expect(userList[0]).toEqual(expected);

  expect(userList[0]).toBeInstanceOf(User);
});

test('getUser() returns a single user', async () => {
  const expected = new User({
    id: 'user_noone',
  });

  nock('https://api.clerk.dev')
    .get(`/v1/users/${expected.id}`)
    .replyWithFile(200, __dirname + '/responses/getUser.json', {
      'Content-Type': 'application/x-www-form-urlencoded',
    });

  const user = await users.getUser(expected.id as string);

  // expect(user).toMatchObject(expected);

  expect(user).toBeInstanceOf(User);
});

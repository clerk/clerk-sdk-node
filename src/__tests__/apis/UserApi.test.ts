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

  const userList = await users.getUserList({ limit: 1 });

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

  const userList = await users.getUserList({ limit: 1, offset: 1 });

  expect(userList).toBeInstanceOf(Array);
  expect(userList.length).toEqual(1);

  // const expected = new User();

  // expect(userList[0]).toEqual(expected);

  expect(userList[0]).toBeInstanceOf(User);
});

test('getUserList() with emails returns a list of users', async () => {
  nock('https://api.clerk.dev')
      .get('/v1/users?email_address=email1&email_address=email2')
      .replyWithFile(200, __dirname + '/responses/getUserList.json', {
        'Content-Type': 'application/x-www-form-urlencoded',
      });

  const userList = await users.getUserList({ emailAddress: ['email1', 'email2'] });

  expect(userList).toBeInstanceOf(Array);
  expect(userList.length).toEqual(1);
  expect(userList[0]).toBeInstanceOf(User);
});

test('getUserList() with phone numbers returns a list of users', async () => {
  nock('https://api.clerk.dev')
      .get('/v1/users?phone_number=phone1&phone_number=phone2')
      .replyWithFile(200, __dirname + '/responses/getUserList.json', {
        'Content-Type': 'application/x-www-form-urlencoded',
      });

  const userList = await users.getUserList({ phoneNumber: ['phone1', 'phone2'] });

  expect(userList).toBeInstanceOf(Array);
  expect(userList.length).toEqual(1);
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

  expect(user.externalAccounts.length).toEqual(2);
  expect(user.externalAccounts[0].provider).toEqual('google');
  expect(user.externalAccounts[1].provider).toEqual('facebook');

  const expectedPublicMetadata = { zodiac_sign: 'leo', ascendant: 'scorpio' };
  expect(user.publicMetadata).toEqual(expectedPublicMetadata);
});

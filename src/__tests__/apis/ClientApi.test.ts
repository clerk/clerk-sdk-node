import nock from 'nock';
import { clients, Client } from '../../index';

test('getClientList() returns a list of clients', async () => {
  nock('https://api.clerk.dev')
    .get('/v1/clients')
    .replyWithFile(200, __dirname + '/responses/getClientList.json', {
      'Content-Type': 'application/x-www-form-urlencoded',
    });

  const clientList = await clients.getClientList();

  expect(clientList).toBeInstanceOf(Array);
  expect(clientList.length).toEqual(2);

  const expected1 = new Client({
    id: 'client_isalwaysright',
    sessionIds: ['sess_swag'],
    signInAttemptId: null,
    signUpAttemptId: null,
    lastActiveSessionId: 'sess_swag',
    createdAt: 1613593529,
    updatedAt: 1613593529,
  });

  const expected2 = new Client({
    id: 'client_keysersoze',
    sessionIds: ['sess_mood'],
    signInAttemptId: 'sia_qwerty',
    signUpAttemptId: null,
    lastActiveSessionId: null,
    createdAt: 1612308722,
    updatedAt: 1612308722,
  });

  expect(clientList[0]).toEqual(expected1);
  expect(clientList[1]).toEqual(expected2);
});

test('getClient() returns a single client', async () => {
  const expected = new Client({
    id: 'client_server',
    sessionIds: ['sess_onthebeach'],
    signInAttemptId: 'sia_cheepthrills',
    signUpAttemptId: null,
    lastActiveSessionId: null,
    createdAt: 1610706634,
    updatedAt: 1610706634,
  });

  nock('https://api.clerk.dev')
    .get(`/v1/clients/${expected.id}`)
    .replyWithFile(200, __dirname + '/responses/getClient.json', {
      'Content-Type': 'application/x-www-form-urlencoded',
    });

  const client = await clients.getClient(expected.id as string);

  expect(client).toEqual(expected);
});

test('verifyClient() returns a client if verified', async () => {
  const expected = new Client({
    id: 'client_server',
    sessionIds: ['sess_onthebeach'],
    signInAttemptId: 'sia_cheepthrills',
    signUpAttemptId: null,
    lastActiveSessionId: null,
    createdAt: 1610706634,
    updatedAt: 1610706634,
  });

  const sessionToken = 'random_jwt_token';

  const encodedBody = new URLSearchParams({ token: sessionToken }).toString();

  nock('https://api.clerk.dev')
    .post(`/v1/clients/verify`, encodedBody)
    .replyWithFile(200, __dirname + '/responses/getClient.json', {
      'Content-Type': 'application/x-www-form-urlencoded',
    });

  const client = await clients.verifyClient(sessionToken);

  expect(client).toEqual(expected);
});

import deserialize from '../../utils/Deserializer';

import { Client } from '../../resources/Client';
import { Email } from '../../resources/Email';
import { Session } from '../../resources/Session';
import { SMSMessage } from '../../resources/SMSMessage';
// import { User } from '../../resources/User';

const clientJSON = {
  object: 'client',
  id: 'client_wxyz',
  session_ids: ['sess_abcd', 'sess_efgh'],
  sign_in_attempt_id: null,
  sign_up_id: null,
  last_active_session_id: 'sess_efgh',
  created_at: 1612378465,
  updated_at: 1612378465,
};

const emailJSON = {
  object: 'email',
  id: 'ema_dvorak',
  from_email_name: 'sales',
  to_email_address: 'accounting@cyberdyne.com',
  email_address_id: 'idn_snafu',
  subject: 'Business trip reimbursement',
  body:
    'Please find attached the invoices for expenses made during the visit to NY.',
  status: 'queued',
};

const sessionJSON = {
  object: 'session',
  id: 'sess_efgh',
  client_id: 'client_wxyz',
  user_id: 'user_rock',
  status: 'active',
  last_active_at: 1612378465,
  expire_at: 1612378465,
  abandon_at: 1612378465,
};

const smsMessageJSON = {
  object: 'sms_message',
  id: 'sms_qwerty',
  from_phone_number: '+12345551001',
  to_phone_number: '+12345551001',
  phone_number_id: 'idn_foobar',
  message: "Don't forget to bring a towel",
  status: 'queued',
};

test('deserializes a Client object', () => {
  const client = deserialize(clientJSON);
  expect(client).toBeInstanceOf(Client);
});

test('deserializes an array of Client objects', () => {
  const clients = deserialize([clientJSON]);
  expect(clients).toBeInstanceOf(Array);
  expect(clients.length).toBe(1);
  expect(clients[0]).toBeInstanceOf(Client);
});

test('deserializes an Email object', () => {
  const email = deserialize(emailJSON);
  expect(email).toBeInstanceOf(Email);
});

test('deserializes a Session object', () => {
  const session = deserialize(sessionJSON);
  expect(session).toBeInstanceOf(Session);
});

test('deserializes an array of Session objects', () => {
  const sessions = deserialize([sessionJSON]);
  expect(sessions).toBeInstanceOf(Array);
  expect(sessions.length).toBe(1);
  expect(sessions[0]).toBeInstanceOf(Session);
});

test('deserializes an SmsMessage object', () => {
  const client = deserialize(smsMessageJSON);
  expect(client).toBeInstanceOf(SMSMessage);
});

// TODO User deserialization

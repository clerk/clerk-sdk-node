import nock from 'nock';
import snakecaseKeys from 'snakecase-keys';
import querystring from 'querystring';
import { smsMessages, SMSMessage } from '../../index';

test('createSMSMessage() sends an SMS message', async () => {
  const phoneNumberId = 'idn_random';
  const message = 'Press F to pay pespects';

  const encodedBody = querystring.stringify(
    snakecaseKeys({ phoneNumberId, message })
  );

  nock('https://api.clerk.dev')
    .post('/v1/sms_messages', encodedBody)
    .replyWithFile(200, __dirname + '/responses/createSMSMessage.json', {
      'Content-Type': 'application/x-www-form-urlencoded',
    });

  const smsMessage = await smsMessages.createSMSMessage({
    phoneNumberId,
    message,
  });

  const expected = new SMSMessage({
    fromPhoneNumber: '+19516231001',
    toPhoneNumber: '+306957178227',
    phoneNumberId,
    message,
    status: 'queued',
  });

  expect(smsMessage).toMatchObject(expected);
});

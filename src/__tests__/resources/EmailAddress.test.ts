import { EmailAddress } from '../../resources/EmailAddress';

test('email address defaults', function() {
  const emailAddress = new EmailAddress();
  expect(emailAddress.linkedTo).toEqual([]);
});

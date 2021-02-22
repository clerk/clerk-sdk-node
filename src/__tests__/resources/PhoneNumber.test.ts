import { PhoneNumber } from '../../resources/PhoneNumber';

test('phone number defaults', function() {
  const phoneNumber = new PhoneNumber();
  expect(phoneNumber.linkedTo).toEqual([]);
});

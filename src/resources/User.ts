import type {
  EmailAddressResource,
  GoogleAccountJSON,
  GoogleAccountResource,
  PhoneNumberResource,
  UserJSON,
  UserResource,
} from '../types/resources';

import { EmailAddress } from './EmailAddress';
import { GoogleAccount } from './GoogleAccount';
import { PhoneNumber } from './PhoneNumber';

export class User implements UserResource {
  id: string;
  username: string | null;
  emailAddresses: EmailAddressResource[];
  phoneNumbers: PhoneNumberResource[];
  externalAccounts: GoogleAccountResource[];
  passwordEnabled: boolean;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null = null;
  primaryEmailAddressId: string | null = null;
  primaryEmailAddress: EmailAddressResource | null = null;
  primaryPhoneNumberId: string | null = null;
  primaryPhoneNumber: PhoneNumberResource | null = null;
  profileImageUrl: string;

  constructor(data: UserJSON) {
    this.id = data.id;
    this.firstName = data.first_name;
    this.lastName = data.last_name;

    if (this.firstName && this.lastName) {
      this.fullName = this.firstName + ' ' + this.lastName;
    }

    this.profileImageUrl = data.profile_image_url;
    this.username = data.username;
    this.passwordEnabled = data.password_enabled;
    this.emailAddresses = data.email_addresses.map((x) => new EmailAddress(x));

    this.primaryEmailAddressId = data.primary_email_address_id;
    this.primaryEmailAddress =
      this.emailAddresses.find((x) => x.id === this.primaryEmailAddressId) ||
      null;

    this.phoneNumbers = data.phone_numbers.map((x) => new PhoneNumber(x));

    this.primaryPhoneNumberId = data.primary_phone_number_id;
    this.primaryPhoneNumber =
      this.phoneNumbers.find((x) => x.id === this.primaryPhoneNumberId) || null;

    this.externalAccounts = data.external_accounts.map(
      (extAcc: GoogleAccountJSON) => new GoogleAccount(extAcc)
    );
  }
}

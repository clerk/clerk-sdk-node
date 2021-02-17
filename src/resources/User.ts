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
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  birthday: string | null;
  profileImageUrl: string;
  primaryEmailAddressId: string | null;
  primaryPhoneNumberId: string | null;
  passwordEnabled: boolean;
  twoFactorEnabled: boolean;
  emailAddresses: EmailAddressResource[];
  phoneNumbers: PhoneNumberResource[];
  externalAccounts: GoogleAccountResource[];
  publicMetadata: object;
  privateMetadata: object;
  createdAt: number;
  updatedAt: number;

  constructor(data: UserJSON) {
    this.id = data.id;
    this.username = data.username;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.gender = data.gender;
    this.birthday = data.birthday;
    this.profileImageUrl = data.profile_image_url;
    this.primaryEmailAddressId = data.primary_email_address_id;
    this.primaryPhoneNumberId = data.primary_phone_number_id;
    this.passwordEnabled = data.password_enabled;
    this.twoFactorEnabled = data.two_factor_enabled;
    this.emailAddresses = data.email_addresses.map((x) => new EmailAddress(x));
    this.phoneNumbers = data.phone_numbers.map((x) => new PhoneNumber(x));
    this.externalAccounts = data.external_accounts.map((x: GoogleAccountJSON) => new GoogleAccount(x));
    this.publicMetadata = data.public_metadata;
    this.privateMetadata = data.private_metadata;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }
}

import {
  SignInIdentifier,
  SignInFactorStrategy,
  SignInStatus,
  SignUpAttibuteRequirements,
  SignUpIdentificationRequirements,
  SignUpStatus,
} from './Enums';

export interface ClerkResourceJSON {
  object: string;
  id: string;
}

export interface ClientJSON extends ClerkResourceJSON {
  object: 'client';
  session_ids: string[];
  sign_in_attempt_id: string | null;
  sign_up_attempt_id: string | null;
  last_active_session_id: string | null;
  created_at: number;
  updated_at: number;
}

export interface EmailJSON extends ClerkResourceJSON {
  from_email_name: string;
  to_email_address: string;
  email_address_id: string;
  subject: string;
  body: string;
  status: string;
}

export interface EmailAddressJSON extends ClerkResourceJSON {
  object: 'email_address';
  email_address: string;
  verification: VerificationJSON | null;
  linked_to: Array<IdentificationLinkJSON>;
}

export interface GoogleAccountJSON extends ClerkResourceJSON {
  object: 'google_account';
  google_id: string;
  approved_scopes: string;
  email_address: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export interface IdentificationLinkJSON extends ClerkResourceJSON {
  type: string;
}

export interface PhoneNumberJSON extends ClerkResourceJSON {
  object: 'phone_number';
  phone_number: string;
  reserved_for_second_factor: boolean;
  linked_to: Array<IdentificationLinkJSON>;
  verification: VerificationJSON | null;
}

export interface SessionJSON extends ClerkResourceJSON {
  object: 'session';
  client_id: string;
  user_id: string;
  status: string;
  last_active_at: number;
  expire_at: number;
  abandon_at: number;
}

export interface SignInJSON extends ClerkResourceJSON {
  object: 'sign_in_attempt';
  status: SignInStatus;
  allowed_identifier_types: SignInIdentifier[];
  identifier: string;
  allowed_factor_one_strategies: SignInFactorStrategy[];
  factor_one_verification: VerificationJSON | null;
  factor_two_verification: VerificationJSON | null;
  created_session_id: string | null;
}

export interface SignUpJSON extends ClerkResourceJSON {
  object: 'sign_up_attempt';
  status: SignUpStatus;
  identification_requirements: SignUpIdentificationRequirements;
  attribute_requirements: SignUpAttibuteRequirements;
  username: string | null;
  email_address: string | null;
  email_address_verification: VerificationJSON | null;
  phone_number: string | null;
  phone_number_verification: VerificationJSON | null;
  external_account_strategy: string | null;
  external_account_verification: VerificationJSON | null;
  external_account: any;
  has_password: boolean;
  name_full: string | null;
  created_session_id: string | null;
  abandon_at: number | null;
}

export interface SMSMessageJSON extends ClerkResourceJSON {
  object: 'sms_message';
  from_phone_number: string;
  to_phone_number: string;
  phone_number_id: string;
  message: string;
  status: string;
}

export interface UserJSON extends ClerkResourceJSON {
  object: 'user';
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: string;
  profile_image_url: string;
  primary_email_address_id: string;
  primary_phone_number_id: string;
  password_enabled: boolean;
  two_factor_enabled: boolean;
  email_addresses: EmailAddressJSON[];
  phone_numbers: PhoneNumberJSON[];
  external_accounts: GoogleAccountJSON[];
  public_metadata: object;
  private_metadata: object;
  created_at: number;
  updated_at: number;
}

export interface VerificationJSON extends ClerkResourceJSON {
  status: string;
  strategy: string;
  external_verification_redirect_url: string;
  attempts: number;
  expire_at: number;
}

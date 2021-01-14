import { Client } from '../resources/Client';

export interface ClerkResourceJSON {
  object: string;
  id: string;
}

export interface ClerkResource {
  id: string;
}

export interface ClientJSON extends ClerkResourceJSON {
  object: 'client';
  ended: boolean;
  sessions: SessionJSON[];
  sign_in_attempt_id: string | null;
  sign_up_attempt_id: string | null;
  last_active_session_id: string | null;
}

export interface ClientResource extends ClerkResource {
  ended: boolean;
  sessions: SessionResource[];
  signInAttemptId: string | null;
  signUpAttemptId: string | null;
  lastActiveSessionId: string | null;
}

export interface EmailJSON extends ClerkResourceJSON {
  from_email_name: string;
  to_email_address: string;
  email_address_id: string;
  subject: string;
  body: string;
  status: string;
}

export interface EmailResource extends ClerkResource {
  fromEmailName: string;
  toEmailAddress: string;
  emailAddressId: string;
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

export interface EmailAddressResource extends ClerkResource {
  emailAddress: string;
  verification: VerificationResource;
  linkedTo: Array<IdentificationLinkResource>;
}

export interface PhoneNumberJSON extends ClerkResourceJSON {
  object: 'phone_number';
  phone_number: string;
  reserved_for_second_factor: boolean;
  linked_to: Array<IdentificationLinkJSON>;
  verification: VerificationJSON | null;
}

export interface PhoneNumberResource extends ClerkResource {
  phoneNumber: string;
  verification: VerificationResource;
  reservedForSecondFactor: boolean;
  linkedTo: Array<IdentificationLinkResource>;
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

export interface GoogleAccountResource extends ClerkResource {
  googleId: string;
  approvedScopes: string;
  emailAddress: string;
  givenName: string;
  familyName: string;
  picture: string;
}

export type SignInIdentifier =
  | 'username'
  | 'email_address'
  | 'phone_number'
  | 'oauth_google';

export type SignInFactorStrategy =
  | 'password'
  | 'oauth_google'
  | 'phone_code'
  | 'email_code';

export type SignInStatus =
  | 'needs_identifier'
  | 'needs_factor_one'
  | 'needs_factor_two'
  | 'complete';

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

export interface SignInResource {
  status: SignInStatus | null;
  allowedIdentifierTypes: SignInIdentifier[];
  identifier: string | null;
  allowedFactorOneStrategies: SignInFactorStrategy[];
  factorOneVerification: VerificationResource;
  factorTwoVerification: VerificationResource;
  createdSessionId: string | null;
}

export type SignUpStatus = 'missing_requirements' | 'complete' | 'abondoned';

export type SignUpIdentificationRequirements = (
  | 'email_address'
  | 'phone_number'
  | 'username'
  | 'oauth_google'
)[][];

export type SignUpAttibuteRequirements = (
  | 'name_title'
  | 'name_middle'
  | 'name_last'
  | 'name_suffix'
  | 'age'
  | 'gender'
)[][];

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

export interface SignUpResource {
  status: SignUpStatus | null;
  identificationRequirements: SignUpIdentificationRequirements;
  attributeRequirements: SignUpAttibuteRequirements;
  username: string | null;
  emailAddress: string | null;
  emailAddressVerification: VerificationResource;
  phoneNumber: string | null;
  phoneNumberVerification: VerificationResource;
  externalAccountStrategy: string | null;
  externalAccountVerification: VerificationResource;
  externalAccount: any;
  hasPassword: boolean;
  createdSessionId: string | null;
  abandonAt: number | null;
}

export interface UserJSON extends ClerkResourceJSON {
  object: 'user';
  primary_email_address_id: string;
  primary_phone_number_id: string;
  profile_image_url: string;
  username: string;
  email_addresses: EmailAddressJSON[];
  phone_numbers: PhoneNumberJSON[];
  external_accounts: any;
  password_enabled: boolean;
  first_name: string;
  last_name: string;
}

export interface UserResource extends ClerkResource {
  primaryEmailAddressId: string | null;
  primaryEmailAddress: EmailAddressResource | null;
  primaryPhoneNumberId: string | null;
  primaryPhoneNumber: PhoneNumberResource | null;
  username: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string;
  emailAddresses: EmailAddressResource[];
  phoneNumbers: PhoneNumberResource[];
  externalAccounts: GoogleAccountResource[];
  passwordEnabled: boolean;
}

export interface IdentificationLinkJSON {
  id: string;
  type: string;
}

export interface IdentificationLinkResource {
  id: string;
  type: string;
}

export interface SessionJSON extends ClerkResourceJSON {
  object: 'session';
  status: string;
  expire_at: number;
  abandon_at: number;
}

export interface SessionResource extends ClerkResource {
  status: string;
  expireAt: Date;
  abandonAt: Date;
}

export interface SMSMessageJSON extends ClerkResourceJSON {
  object: 'sms_message';
  from_phone_number: string;
  to_phone_number: string;
  phone_number_id: string;
  message: string;
  status: string;
}

export interface SMSMessageResource extends ClerkResource {
  fromPhoneNumber: string;
  toPhoneNumber: string;
  phoneNumberId: string;
  message: string;
  status: string;
}

export interface VerificationJSON {
  status: string;
  strategy: string;
  external_verification_redirect_url?: string;
  attempts: number;
  expire_at: number;
}

export interface VerificationResource {
  status: string | null;
  strategy: string | null;
  externalVerificationRedirectURL: URL | null;
  attempts: number | null;
  expireAt: Date | null;
}

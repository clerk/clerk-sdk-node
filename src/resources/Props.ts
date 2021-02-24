import { Nullable } from './Nullable';

import {
  SignInFactorStrategy,
  SignInIdentifier,
  SignInStatus,
  SignUpIdentificationRequirements,
  SignUpAttibuteRequirements,
  SignUpStatus,
} from './Enums';

export interface ClerkProps {
  id: Nullable<string>;
}

export interface ClientProps extends ClerkProps {
  sessionIds: string[];
  signInAttemptId: Nullable<string>;
  signUpAttemptId: Nullable<string>;
  lastActiveSessionId: Nullable<string>;
  createdAt: Nullable<number>;
  updatedAt: Nullable<number>;
}

export interface EmailProps extends ClerkProps {
  fromEmailName: Nullable<string>;
  toEmailAddress: Nullable<string>;
  emailAddressId: Nullable<string>;
  subject: Nullable<string>;
  body: Nullable<string>;
  status: Nullable<string>;
}

export interface EmailAddressProps extends ClerkProps {
  emailAddress: Nullable<string>;
  // verification: Nullable<VerificationProps>;
  // linkedTo: Array<IdentificationLinkProps>;
}

export interface GoogleAccountProps extends ClerkProps {
  googleId: Nullable<string>;
  approvedScopes: Nullable<string>;
  emailAddress: Nullable<string>;
  givenName: Nullable<string>;
  familyName: Nullable<string>;
  picture: Nullable<string>;
}

export interface IdentificationLinkProps extends ClerkProps {
  type: Nullable<string>;
}

export interface PhoneNumberProps extends ClerkProps {
  phoneNumber: Nullable<string>;
  // verification: Nullable<VerificationProps>;
  reservedForSecondFactor: boolean;
  // linkedTo: Array<IdentificationLinkProps>;
}

export interface SessionProps extends ClerkProps {
  clientId: Nullable<string>;
  userId: Nullable<string>;
  status: Nullable<string>;
  lastActiveAt: Nullable<number>;
  expireAt: Nullable<number>;
  abandonAt: Nullable<number>;
}

// Unused
export interface SignInProps {
  status: SignInStatus | null;
  allowedIdentifierTypes: SignInIdentifier[];
  identifier: string | null;
  allowedFactorOneStrategies: SignInFactorStrategy[];
  // factorOneVerification: VerificationProps;
  // factorTwoVerification: VerificationProps;
  createdSessionId: string | null;
}

// Unused
export interface SignUpProps {
  status: SignUpStatus | null;
  identificationRequirements: SignUpIdentificationRequirements;
  attributeRequirements: SignUpAttibuteRequirements;
  username: string | null;
  emailAddress: string | null;
  //emailAddressVerification: VerificationProps;
  phoneNumber: string | null;
  //phoneNumberVerification: VerificationProps;
  externalAccountStrategy: string | null;
  //externalAccountVerification: VerificationProps;
  externalAccount: any;
  hasPassword: boolean;
  createdSessionId: string | null;
  abandonAt: number | null;
}

export interface SMSMessageProps extends ClerkProps {
  fromPhoneNumber: Nullable<string>;
  toPhoneNumber: Nullable<string>;
  phoneNumberId: Nullable<string>;
  message: Nullable<string>;
  status: Nullable<string>;
}

export interface UserProps extends ClerkProps {
  username: Nullable<string>;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  gender: Nullable<string>;
  birthday: Nullable<string>;
  profileImageUrl: Nullable<string>;
  primaryEmailAddressId: Nullable<string>;
  primaryPhoneNumberId: Nullable<string>;
  passwordEnabled: boolean;
  twoFactorEnabled: boolean;
  // emailAddresses: EmailAddressProps[];
  // phoneNumbers: PhoneNumberProps[];
  // externalAccounts: GoogleAccountProps[];
  publicMetadata: {[key: string]: string};
  privateMetadata: {[key: string]: string};
  createdAt: Nullable<number>;
  updatedAt: Nullable<number>;
}

export interface VerificationProps {
  status: Nullable<string>;
  strategy: Nullable<string>;
  externalVerificationRedirectURL: Nullable<URL>;
  attempts: Nullable<number>;
  expireAt: Nullable<number>;
}

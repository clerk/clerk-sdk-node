export enum Association {
  HasOne = 'HasOne',
  HasMany = 'HasMany',
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

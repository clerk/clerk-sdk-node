import camelcaseKeys from 'camelcase-keys';
import filterKeys from '../utils/Filter';

import type { GoogleAccountJSON } from './JSON';
import type { GoogleAccountProps } from './Props';

interface GoogleAccountPayload extends GoogleAccountProps {};

export interface GoogleAccount extends GoogleAccountPayload {};

export class GoogleAccount {
  static attributes = ['id', 'googleId', 'approvedScopes', 'emailAddress',
    'emailAddress', 'givenName', 'familyName', 'picture'];

  static defaults = {};

  constructor(data: Partial<GoogleAccountPayload> = {}) {
    Object.assign(this, GoogleAccount.defaults, data);
  }

  static fromJSON(data: GoogleAccountJSON): GoogleAccount {
    const camelcased = camelcaseKeys(data);
    const filtered = filterKeys(camelcased, GoogleAccount.attributes);
    return new GoogleAccount(filtered as GoogleAccountPayload);
  }
}

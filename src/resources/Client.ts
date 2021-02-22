import camelcaseKeys from 'camelcase-keys';
import filterKeys from '../utils/Filter';

import type { ClientJSON } from './JSON';
import type { ClientProps } from './Props';

interface ClientPayload extends ClientProps {};

export interface Client extends ClientPayload {};

export class Client {
  static attributes = ['id', 'sessionIds', 'signUpAttemptId', 'signInAttemptId',
    'lastActiveSessionId', 'lastActiveSessionId', 'createdAt', 'updatedAt'];

  static defaults = {};

  constructor(data: Partial<ClientPayload> = {}) {
    Object.assign(this, Client.defaults, data);
  }

  static fromJSON(data: ClientJSON): Client {
    const camelcased = camelcaseKeys(data);
    const filtered = filterKeys(camelcased, Client.attributes);
    return new Client(filtered as ClientPayload);
  }
}

import type { ExternalAccountJSON, FacebookAccountJSON, GoogleAccountJSON } from './JSON';
import { ObjectType } from './JSON';

import type { ExternalAccountProps } from './Props';
import { Provider } from "./Props";

interface ExternalAccountPayload extends ExternalAccountProps {};

export interface ExternalAccount extends ExternalAccountPayload {};

export class ExternalAccount {
    static attributes = ['id', 'provider', 'externalId', 'approvedScopes',
        'emailAddress', 'firstName', 'lastName', 'picture'];

    static defaults = {};

    constructor(data: Partial<ExternalAccountPayload> = {}) {
        Object.assign(this, ExternalAccount.defaults, data);
    }

    static fromJSON(data: ExternalAccountJSON): ExternalAccount {
        const obj = {} as ExternalAccountPayload;

        obj.id = data.id;
        obj.approvedScopes = data.approved_scopes;
        obj.emailAddress = data.email_address;
        obj.picture = data.picture;

        switch (data.object) {
            case ObjectType.FacebookAccount: {
                obj.provider = Provider.Facebook;
                const fbData = data as FacebookAccountJSON;
                obj.externalId = fbData.facebook_id;
                obj.firstName = fbData.first_name;
                obj.lastName = fbData.last_name;
                break;
            }
            case ObjectType.GoogleAccount: {
                obj.provider = Provider.Google;
                const gData = data as GoogleAccountJSON;
                obj.externalId = gData.google_id;
                obj.firstName = gData.given_name;
                obj.lastName = gData.family_name;
                break;
            }
            default:
                throw new Error('Unsupported external account type');
        }

        return new ExternalAccount(obj);
    }
}

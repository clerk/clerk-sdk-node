import camelcaseKeys from "camelcase-keys";
import filterKeys from "../utils/Filter";
import associationDefaults from "../utils/Associations";

import { Association } from "./Enums";
import type { JWKJSON, JWKSJSON } from "./JSON";
import type { JWKSProps } from "./Props";

import { JWK } from "./JWK";

interface JWKSAssociations {
    keys: JWK[];
}

interface JWKSPayload extends JWKSProps, JWKSAssociations {};

export interface JWKS extends JWKSPayload {};

export class JWKS {
    static attributes = ['keys'];

    static associations = {
        keys: Association.HasMany
    };

    static defaults = associationDefaults(JWKS.associations);

    constructor(data: Partial<JWKSPayload> = {}) {
        Object.assign(this, JWKS.defaults, data);
    }

    static fromJSON(data: JWKSJSON): JWKS {
        const obj: Record<string, any> = {};

        const camelcased = camelcaseKeys(data);
        const filtered = filterKeys(camelcased, JWKS.attributes);
        Object.assign(obj, filtered);

        obj.keys = (data.keys || []).map((x: JWKJSON) => JWK.fromJSON(x));

        return new JWKS(obj as JWKSPayload);
    }
}
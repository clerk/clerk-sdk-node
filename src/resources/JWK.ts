import camelcaseKeys from "camelcase-keys";
import filterKeys from "../utils/Filter";

import type { JWKJSON } from "./JSON";
import type { JWKProps } from "./Props";

interface JWKPayload extends JWKProps {};

export interface JWK extends JWKPayload {};

export class JWK {
    static attributes = ['use', 'kty', 'kid', 'alg', 'n', 'e'];

    static defaults = {};

    constructor(data: Partial<JWKPayload> = {}) {
        Object.assign(this, JWK.defaults, data);
    }

    static fromJSON(data: JWKJSON): JWK {
        const camelcased = camelcaseKeys(data);
        const filtered = filterKeys(camelcased, JWK.attributes);
        return new JWK(filtered as JWKPayload)
    }
}
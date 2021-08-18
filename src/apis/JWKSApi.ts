import { AbstractApi } from './AbstractApi';
import { JWKS } from "../resources/JWKS";

export class JWKSApi extends AbstractApi {
    public async getJWKS(): Promise<JWKS> {
        return this._restClient.makeRequest({
            method: 'get',
            path: '/jwks',
        });
    }
}

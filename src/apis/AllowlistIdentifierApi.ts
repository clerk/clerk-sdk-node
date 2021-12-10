import { AbstractApi } from './AbstractApi';
import { AllowlistIdentifier } from '../resources/AllowlistIdentifier';

const basePath = '/allowlist_identifiers';

type AllowlistIdentifierCreateParams = {
  identifier: string;
  notify: boolean;
};

export class AllowlistIdentifierApi extends AbstractApi {
  public async getAllowlistIdentifierList(): Promise<
    Array<AllowlistIdentifier>
  > {
    return this._restClient.makeRequest({
      method: 'get',
      path: basePath,
    });
  }

  public async createAllowlistIdentifier(
    params: AllowlistIdentifierCreateParams
  ): Promise<AllowlistIdentifier> {
    return this._restClient.makeRequest({
      method: 'post',
      path: basePath,
      bodyParams: params,
    });
  }

  public async deleteAllowlistIdentifier(
    allowlistIdentifierId: string
  ): Promise<AllowlistIdentifier> {
    return this._restClient.makeRequest({
      method: 'delete',
      path: `${basePath}/${allowlistIdentifierId}`,
    });
  }
}

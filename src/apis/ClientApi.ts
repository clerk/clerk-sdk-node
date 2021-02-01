import { AbstractApi } from './AbstractApi';
import { Client } from '../resources/Client';

export class ClientApi extends AbstractApi {
  public async getClientList(): Promise<Array<Client>> {
    return this._restClient.makeRequest({
      method: 'get',
      path: '/clients',
    });
  }

  public async getClient(clientId: string): Promise<Client> {
    return this._restClient.makeRequest({
      method: 'get',
      path: `/clients/${clientId}`,
    });
  }

  public verifyClient(token: string): Promise<Client> {
    return this._restClient.makeRequest({
      method: 'post',
      path: '/clients/verify',
      bodyParams: { token },
    });
  }
}

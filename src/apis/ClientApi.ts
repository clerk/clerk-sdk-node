import { AbstractApi } from './AbstractApi';
import { Client } from '../resources/Client';

export class ClientApi extends AbstractApi {
  public async getClientList(): Promise<Array<Client>> {
    return this.restClient.makeRequest({
      method: 'get',
      path: '/clients',
      collection: true,
    });
  }

  public async getClient(clientId: string): Promise<Client> {
    return this.restClient.makeRequest({
      method: 'get',
      path: `/clients/${clientId}`,
    });
  }

  // TODO authenticate
}

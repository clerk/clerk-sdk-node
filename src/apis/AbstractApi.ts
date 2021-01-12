import { RestClient } from '../utils/RestClient';

export abstract class AbstractApi {
  restClient: RestClient;

  constructor(restClient: RestClient) {
    this.restClient = restClient;
  }
}

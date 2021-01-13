import { RestClient } from './utils/RestClient';

// TODO import dynamically
import { UserApi } from './apis/UserApi';
import { SessionApi } from './apis/SessionApi';

const defaultApiVersion = 'v1';
const defaultBaseUrl = 'https://api.clerk.dev';

export class ClerkServerSDK {
  accessToken: string;
  baseUrl: string = defaultBaseUrl;
  apiVersion: string = defaultApiVersion;
  restClient: RestClient;

  // private api instances
  private _userApi?: UserApi;
  private _sessionApi?: SessionApi;

  constructor(
    accessToken: string,
    {
      baseUrl = defaultBaseUrl,
      apiVersion = defaultApiVersion,
    }: { baseUrl?: string; apiVersion?: string } = {}
  ) {
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;

    if (baseUrl) {
      this.baseUrl = baseUrl;
    }

    this.restClient = new RestClient(
      this.accessToken,
      this.baseUrl,
      this.apiVersion
    );
  }

  get userApi(): UserApi {
    if (!this._userApi) {
      this._userApi = new UserApi(this.restClient);
    }

    return this._userApi;
  }

  get sessionApi(): SessionApi {
    if (!this._sessionApi) {
      this._sessionApi = new SessionApi(this.restClient);
    }

    return this._sessionApi;
  }
}

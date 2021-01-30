import { RestClient } from './utils/RestClient';

// TODO import dynamically
import { ClientApi } from './apis/ClientApi';
import { EmailApi } from './apis/EmailApi';
import { SessionApi } from './apis/SessionApi';
import { SMSMessageApi } from './apis/SMSMessageApi';
import { UserApi } from './apis/UserApi';

// TODO import dynamically or from single index file
import { Client } from './resources/Client';
import { Email } from './resources/Email';
import { EmailAddress } from './resources/EmailAddress';
import { GoogleAccount } from './resources/GoogleAccount';
import { IdentificationLink } from './resources/IdentificationLink';
import { PhoneNumber } from './resources/PhoneNumber';
import { Session } from './resources/Session';
import { SMSMessage } from './resources/SMSMessage';
import { User } from './resources/User';
import { Verification } from './resources/Verification';

const defaultApiKey = process.env.CLERK_API_KEY || '';
const defaultApiVersion = process.env.CLERK_API_VERSION || 'v1';
const defaultServerApiUrl =
  process.env.CLERK_API_URL || 'https://api.clerk.dev';

export default class Clerk {
  private _restClient: RestClient;

  // singleton instance
  static _instance: Clerk;

  // TODO we may not need to instantiate these any more if they keep no state
  // private api instances
  private _clientApi?: ClientApi;
  private _emailApi?: EmailApi;
  private _sessionApi?: SessionApi;
  private _smsMessageApi?: SMSMessageApi;
  private _userApi?: UserApi;

  // Namespace resources
  public static Client = Client;
  public static Email = Email;
  public static EmailAddress = EmailAddress;
  public static GoogleAccount = GoogleAccount;
  public static IdentificationLink = IdentificationLink;
  public static PhoneNumber = PhoneNumber;
  public static Session = Session;
  public static SMSMessage = SMSMessage;
  public static User = User;
  public static Verification = Verification;

  constructor({
    apiKey = defaultApiKey,
    serverApiUrl = defaultServerApiUrl,
    apiVersion = defaultApiVersion,
    httpOptions = {},
  }: {
    apiKey?: string;
    serverApiUrl?: string;
    apiVersion?: string;
    httpOptions?: object;
  } = {}) {
    this._restClient = new RestClient(
      apiKey,
      serverApiUrl,
      apiVersion,
      httpOptions
    );
  }

  // For use as singleton, always returns the same instance
  static getInstance() {
    if (!this._instance) {
      this._instance = new Clerk();
    }

    return this._instance;
  }

  // Setters for the embedded rest client

  set apiKey(value: string) {
    this._restClient.apiKey = value;
  }

  set serverApiUrl(value: string) {
    this._restClient.serverApiUrl = value;
  }

  set apiVersion(value: string) {
    this._restClient.apiVersion = value;
  }

  set httpOptions(value: object) {
    this._restClient.httpOptions = value;
  }

  // Lazy sub-api getters

  get clients(): ClientApi {
    if (!this._clientApi) {
      this._clientApi = new ClientApi(this._restClient);
    }

    return this._clientApi;
  }

  get emails(): EmailApi {
    if (!this._emailApi) {
      this._emailApi = new EmailApi(this._restClient);
    }

    return this._emailApi;
  }

  get sessions(): SessionApi {
    if (!this._sessionApi) {
      this._sessionApi = new SessionApi(this._restClient);
    }

    return this._sessionApi;
  }

  get smsMessages(): SMSMessageApi {
    if (!this._smsMessageApi) {
      this._smsMessageApi = new SMSMessageApi(this._restClient);
    }

    return this._smsMessageApi;
  }

  get users(): UserApi {
    if (!this._userApi) {
      this._userApi = new UserApi(this._restClient);
    }

    return this._userApi;
  }
}

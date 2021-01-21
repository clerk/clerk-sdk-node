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

const defaultApiVersion = 'v1';
const defaultServerApiUrl = 'https://api.clerk.dev';

export default class Clerk {
  apiKey: string;
  serverApiUrl: string = defaultServerApiUrl;
  apiVersion: string = defaultApiVersion;
  httpOptions: object = {};
  restClient: RestClient;

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

  constructor(
    apiKey: string,
    {
      serverApiUrl = defaultServerApiUrl,
      apiVersion = defaultApiVersion,
      httpOptions = {},
    }: {
      serverApiUrl?: string;
      apiVersion?: string;
      httpOptions?: object;
    } = {}
  ) {
    this.apiKey = apiKey;
    this.apiVersion = apiVersion;
    this.httpOptions = httpOptions || {};

    if (serverApiUrl) {
      this.serverApiUrl = serverApiUrl;
    }

    this.restClient = new RestClient(
      this.apiKey,
      this.serverApiUrl,
      this.apiVersion,
      this.httpOptions
    );
  }

  get clientApi(): ClientApi {
    if (!this._clientApi) {
      this._clientApi = new ClientApi(this.restClient);
    }

    return this._clientApi;
  }

  get emailApi(): EmailApi {
    if (!this._emailApi) {
      this._emailApi = new EmailApi(this.restClient);
    }

    return this._emailApi;
  }

  get sessionApi(): SessionApi {
    if (!this._sessionApi) {
      this._sessionApi = new SessionApi(this.restClient);
    }

    return this._sessionApi;
  }

  get smsMessageApi(): SMSMessageApi {
    if (!this._smsMessageApi) {
      this._smsMessageApi = new SMSMessageApi(this.restClient);
    }

    return this._smsMessageApi;
  }

  get userApi(): UserApi {
    if (!this._userApi) {
      this._userApi = new UserApi(this.restClient);
    }

    return this._userApi;
  }
}

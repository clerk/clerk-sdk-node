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
const defaultBaseUrl = 'https://api.clerk.dev';

export default class Clerk {
  accessToken: string;
  baseUrl: string = defaultBaseUrl;
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
    accessToken: string,
    {
      baseUrl = defaultBaseUrl,
      apiVersion = defaultApiVersion,
      httpOptions = {},
    }: { baseUrl?: string; apiVersion?: string; httpOptions?: object } = {}
  ) {
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;
    this.httpOptions = httpOptions || {};

    if (baseUrl) {
      this.baseUrl = baseUrl;
    }

    this.restClient = new RestClient(
      this.accessToken,
      this.baseUrl,
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

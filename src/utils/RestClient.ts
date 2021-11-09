import deserialize from './Deserializer';
import handleError from './ErrorHandler';
import snakecaseKeys from 'snakecase-keys';
import * as querystring from 'querystring';
import fetch from 'node-fetch';
import { LIB_NAME, LIB_VERSION } from '../info';

const packageName = LIB_NAME;
const packageVersion = LIB_VERSION;
const packageRepo = 'https://github.com/clerkinc/clerk-sdk-node';
const userAgent = `${packageName}/${packageVersion} (${packageRepo})`;
const contentType = 'application/x-www-form-urlencoded';

declare type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete';

type RequestOptions = {
  method: HTTPMethod;
  path: string;
  queryParams?: object;
  bodyParams?: object;
  responseType?: string;
};

export default class RestClient {
  apiKey: string;
  serverApiUrl: string;
  apiVersion: string;
  httpOptions?: object;

  constructor(
    apiKey: string,
    serverApiUrl: string,
    apiVersion: string,
    httpOptions?: object
  ) {
    this.apiKey = apiKey;
    this.serverApiUrl = serverApiUrl;
    this.apiVersion = apiVersion;
    this.httpOptions = httpOptions || {};
  }

  async makeRequest(requestOptions: RequestOptions) {
    if (!requestOptions.responseType) {
      requestOptions.responseType = 'json';
    }

    let url = `${this.serverApiUrl}/${this.apiVersion}${requestOptions.path}`;

    if (requestOptions.queryParams) {
      url = `${url}?${querystring.stringify(
        snakecaseKeys(requestOptions.queryParams)
      )}`;
    }

    const options: any = {
      method: requestOptions.method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-type': contentType,
        'user-agent': userAgent,
      },
      ...this.httpOptions,
    };

    if (requestOptions.bodyParams) {
      const bodyParams = snakecaseKeys(requestOptions.bodyParams);

      const params = new URLSearchParams();
      Object.keys(bodyParams).forEach(key => params.append(key, bodyParams[key]));

      options.body = params;
    }

    // TODO improve error handling
    try {
      const response = await fetch(url, options)
      return requestOptions.responseType === 'json'? deserialize(await response.json()) : await response.text();
    } catch (error) {
      return handleError(error)
    }
  }
}

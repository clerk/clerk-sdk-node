import got, { Method, OptionsOfUnknownResponseBody, ResponseType } from 'got';
import deserialize from './Deserializer';
import handleError from './ErrorHandler';
import snakecaseKeys from 'snakecase-keys';
import * as querystring from 'querystring';
import { LIB_NAME, LIB_VERSION } from '../info';
import deepmerge from 'deepmerge';

const packageName = LIB_NAME;
const packageVersion = LIB_VERSION;
const packageRepo = 'https://github.com/clerkinc/clerk-sdk-node';
const userAgent = `${packageName}/${packageVersion} (${packageRepo})`;
const contentType = 'application/x-www-form-urlencoded';

type RequestOptions = {
  method: Method;
  path: string;
  queryParams?: object;
  bodyParams?: object;
  responseType?: ResponseType;
};

export default class RestClient {
  apiKey: string;
  serverApiUrl: string;
  apiVersion: string;
  // TODO: Disallow certain header values
  httpOptions: OptionsOfUnknownResponseBody;

  constructor(
    apiKey: string,
    serverApiUrl: string,
    apiVersion: string,
    httpOptions: OptionsOfUnknownResponseBody = {}
  ) {
    this.apiKey = apiKey;
    this.serverApiUrl = serverApiUrl;
    this.apiVersion = apiVersion;
    this.httpOptions = httpOptions || {};
  }

  makeRequest(requestOptions: RequestOptions) {
    let url = `${this.serverApiUrl}/${this.apiVersion}${requestOptions.path}`;

    if (requestOptions.queryParams) {
      url = `${url}?${querystring.stringify(
        snakecaseKeys(requestOptions.queryParams)
      )}`;
    }

    const gotOptions = deepmerge(this.httpOptions, {
      method: requestOptions.method,
      responseType: requestOptions.responseType || 'json',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-type': contentType,
        'user-agent': userAgent,
      },
    });

    if (requestOptions.bodyParams) {
      gotOptions['body'] = querystring.stringify(
        snakecaseKeys(requestOptions.bodyParams)
      );
    }

    // TODO improve error handling
    return got(url, gotOptions)
      .then((data) =>
        gotOptions.responseType === 'json' ? deserialize(data.body) : data.body
      )
      .catch((error) => handleError(error));
  }
}

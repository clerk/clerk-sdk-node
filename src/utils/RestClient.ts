import got, { HTTPAlias } from 'got';
import { deserialize } from './Deserializer';
import { handleError } from './ErrorHandler';
import snakecaseKeys from 'snakecase-keys';
import * as querystring from 'querystring';

// TODO Support setting timeout, retries

const contentType = 'application/x-www-form-urlencoded';

type RequestOptions = {
  method: HTTPAlias;
  path: string;
  queryParams?: object;
  bodyParams?: object;
};

export class RestClient {
  accessToken: string;
  baseUrl: string;
  apiVersion: string;
  httpOptions?: object;

  constructor(
    accessToken: string,
    baseUrl: string,
    apiVersion: string,
    httpOptions?: object
  ) {
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
    this.apiVersion = apiVersion;
    this.httpOptions = httpOptions || {};
  }

  makeRequest(requestOptions: RequestOptions) {
    let url = `${this.baseUrl}/${this.apiVersion}${requestOptions.path}`;

    if (requestOptions.queryParams) {
      url = `${url}?${querystring.stringify(
        snakecaseKeys(requestOptions.queryParams)
      )}`;
    }

    // FIXME remove any
    const gotOptions: any = {
      method: requestOptions.method,
      responseType: 'json' as 'json',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-type': contentType,
      },
      ...this.httpOptions,
    };

    if (requestOptions.bodyParams) {
      gotOptions['form'] = snakecaseKeys(requestOptions.bodyParams);
    }

    // TODO improve error handling
    return got(url, gotOptions)
      .then(data => deserialize(data.body))
      .catch(error => handleError(error));
  }
}

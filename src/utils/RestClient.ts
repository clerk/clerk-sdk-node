import got, { HTTPAlias } from 'got';
import { deserialize } from './Deserializer';
import { handleError } from './ErrorHandler';
import snakecaseKeys from 'snakecase-keys';
import * as querystring from 'querystring';

// TODO Support setting timeout, retries

const packageName = 'clerk-sdk-go'; // TODO get from package.json
const packageVersion = '0.0.3'; // TODO get form package.json
const packageRepo = 'https://github.com/clerkinc/clerk-sdk-node';
const contentType = 'application/x-www-form-urlencoded';

type RequestOptions = {
  method: HTTPAlias;
  path: string;
  queryParams?: object;
  bodyParams?: object;
};

export class RestClient {
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

  makeRequest(requestOptions: RequestOptions) {
    let url = `${this.serverApiUrl}/${this.apiVersion}${requestOptions.path}`;

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
        Authorization: `Bearer ${this.apiKey}`,
        'Content-type': contentType,
        'user-agent': `${packageName}/${packageVersion} (${packageRepo})`,
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

import { AbstractApi } from './AbstractApi';
import { Email } from '../resources/Email';

type EmailParams = {
  fromEmailName: string;
  subject: string;
  body: string;
  emailAddressId: string;
};

export class EmailApi extends AbstractApi {
  public async createEmail(params: EmailParams): Promise<Email> {
    return this._restClient.makeRequest({
      method: 'post',
      path: '/emails',
      bodyParams: params,
    });
  }
}

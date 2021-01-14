import { AbstractApi } from './AbstractApi';
import { SMSMessage } from '../resources/SMSMessage';

type SMSParams = {
  phoneNumberId: string;
  message: string;
};

export class SMSMessageApi extends AbstractApi {
  public async createSMSMessage(params: SMSParams): Promise<SMSMessage> {
    return this.restClient.makeRequest({
      method: 'post',
      path: '/sms_messages',
      bodyParams: params,
    });
  }
}

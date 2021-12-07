import { AbstractApi } from './AbstractApi';
import { Invitation } from '../resources/Invitation';

const basePath = '/invitations';

type CreateParams = {
  emailAddress: string;
};

export class InvitationApi extends AbstractApi {
  public async getInvitationList(): Promise<Array<Invitation>> {
    return this._restClient.makeRequest({
      method: 'get',
      path: basePath,
    });
  }

  public async createInvitation(params: CreateParams): Promise<Invitation> {
    return this._restClient.makeRequest({
      method: 'post',
      path: basePath,
      bodyParams: params,
    });
  }

  public async revokeInvitation(invitationId: string): Promise<Invitation> {
    return this._restClient.makeRequest({
      method: 'post',
      path: `${basePath}/${invitationId}/revoke`,
    });
  }
}

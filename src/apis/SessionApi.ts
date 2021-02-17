import { AbstractApi } from './AbstractApi';
import { Session } from '../resources/Session';

type QueryParams = {
  clientId?: string;
  userId?: string;
};

export class SessionApi extends AbstractApi {
  public async getSessionList(
    queryParams?: QueryParams
  ): Promise<Array<Session>> {
    return this._restClient.makeRequest({
      method: 'get',
      path: '/sessions',
      queryParams: queryParams,
    });
  }

  public async getSession(sessionId: string): Promise<Session> {
    return this._restClient.makeRequest({
      method: 'get',
      path: `/sessions/${sessionId}`,
    });
  }

  public async revokeSession(sessionId: string): Promise<Session> {
    return this._restClient.makeRequest({
      method: 'post',
      path: `/sessions/${sessionId}/revoke`,
    });
  }

  public async verifySession(
    sessionId: string,
    token: string
  ): Promise<Session> {
    return this._restClient.makeRequest({
      method: 'post',
      path: `/sessions/${sessionId}/verify`,
      bodyParams: { token },
    });
  }
}

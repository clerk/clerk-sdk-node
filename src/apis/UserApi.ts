import { AbstractApi } from './AbstractApi';
import { User } from '../resources/User';

// TODO support all params
interface UserParams {
  firstName?: string;
  lastName?: string;
  password?: string;
  primaryEmailAddressID?: string;
  primaryPhoneNumberID?: string;
}

export class UserApi extends AbstractApi {
  public async getUserList(): Promise<Array<User>> {
    return this.restClient.makeRequest({
      method: 'get',
      path: '/users',
      collection: true,
    });
  }

  public async getUser(userId: string): Promise<User> {
    return this.restClient.makeRequest({
      method: 'get',
      path: `/users/${userId}`,
    });
  }

  public async updateUser(
    userId: string,
    params: UserParams = {}
  ): Promise<User> {
    return this.restClient.makeRequest({
      method: 'patch',
      path: `/users/${userId}`,
      bodyParams: params,
    });
  }

  public async deleteUser(userId: string): Promise<User> {
    return this.restClient.makeRequest({
      method: 'delete',
      path: `/users/${userId}`,
    });
  }
}

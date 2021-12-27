import { AbstractApi } from './AbstractApi';
import { User } from '../resources/User';

interface UserParams {
  firstName?: string;
  lastName?: string;
  password?: string;
  primaryEmailAddressID?: string;
  primaryPhoneNumberID?: string;
  publicMetadata?: Record<string, unknown> | string;
  privateMetadata?: Record<string, unknown> | string;
}

interface UserListParams {
  limit?: number;
  offset?: number;
  emailAddress?: string[];
  phoneNumber?: string[];
  userId?: string[];
  orderBy?:
    | 'created_at'
    | 'updated_at'
    | '+created_at'
    | '+updated_at'
    | '-created_at'
    | '-updated_at';
}

export class UserApi extends AbstractApi {
  private stringifyMetadata(metadata: Record<string, unknown> | string): string {
    // The Clerk server API requires metadata fields to be stringified
    // If not already a string, stringify it
    if (metadata && !(typeof metadata == 'string')) {
      return JSON.stringify(metadata);
    } else {
      return metadata;
    }
  }

  public async getUserList(params: UserListParams = {}): Promise<Array<User>> {
    return this._restClient.makeRequest({
      method: 'get',
      path: '/users',
      queryParams: params,
    });
  }

  public async getUser(userId: string): Promise<User> {
    this.requireId(userId);
    return this._restClient.makeRequest({
      method: 'get',
      path: `/users/${userId}`,
    });
  }

  public async updateUser(
    userId: string,
    params: UserParams = {}
  ): Promise<User> {
    this.requireId(userId);

    // The Clerk server API requires metadata fields to be stringified
    if (params.publicMetadata) {
      params.publicMetadata = this.stringifyMetadata(params.publicMetadata);
    }

    if (params.privateMetadata) {
      params.privateMetadata = this.stringifyMetadata(params.privateMetadata);
    }

    return this._restClient.makeRequest({
      method: 'patch',
      path: `/users/${userId}`,
      bodyParams: params,
    });
  }

  public async createUser(
    params: UserParams = {}
  ): Promise<User> {
    if (params.publicMetadata) {
      params.publicMetadata = this.stringifyMetadata(params.publicMetadata);
    }

    if (params.privateMetadata) {
      params.privateMetadata = this.stringifyMetadata(params.privateMetadata);
    }

    return this._restClient.makeRequest({
      method: 'post',
      path: `/users`,
      bodyParams: params,
    });
  }

  public async deleteUser(userId: string): Promise<User> {
    this.requireId(userId);
    return this._restClient.makeRequest({
      method: 'delete',
      path: `/users/${userId}`,
    });
  }
}

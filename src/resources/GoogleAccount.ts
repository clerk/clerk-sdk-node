import type {
  GoogleAccountJSON,
  GoogleAccountResource,
} from "./Base";

export class GoogleAccount implements GoogleAccountResource {
  id: string;
  googleId: string;
  approvedScopes: string;
  emailAddress: string;
  givenName: string;
  familyName: string;
  picture: string;

  constructor(data: GoogleAccountJSON) {
    this.id = data.id;
    this.googleId = data.google_id;
    this.approvedScopes = data.approved_scopes;
    this.emailAddress = data.email_address;
    this.givenName = data.given_name;
    this.familyName = data.family_name;
    this.picture = data.picture;
  }
}

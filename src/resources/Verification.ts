import type {
  VerificationJSON,
  VerificationResource,
} from "../types/resources";

export class Verification implements VerificationResource {
  status: string | null;
  strategy: string | null;
  externalVerificationRedirectURL: URL | null;
  attempts: number | null;
  expireAt: Date | null;

  constructor(data: VerificationJSON | null) {
    if (data) {
      this.status = data.status;
      this.strategy = data.strategy;
      if (data.external_verification_redirect_url) {
        this.externalVerificationRedirectURL = new URL(
          data.external_verification_redirect_url
        );
      } else {
        this.externalVerificationRedirectURL = null;
      }
      this.attempts = data.attempts;
      this.expireAt = new Date(data.expire_at * 1000);
    } else {
      this.status = null;
      this.strategy = null;
      this.externalVerificationRedirectURL = null;
      this.attempts = null;
      this.expireAt = null;
    }
  }
}

import type {
  EmailAddressJSON,
  EmailAddressResource,
  IdentificationLinkResource,
  VerificationResource,
} from "../types/resources";

import { Verification } from "./Verification";
import { IdentificationLink } from "./IdentificationLink";

export class EmailAddress implements EmailAddressResource {
  id: string;
  emailAddress: string;
  verification: VerificationResource;
  linkedTo: Array<IdentificationLinkResource>;

  constructor(data: EmailAddressJSON) {
    this.id = data.id;
    this.emailAddress = data.email_address;
    this.verification = new Verification(data.verification);

    this.linkedTo = data.linked_to.map((link) => {
      return new IdentificationLink(link);
    });
  }
}

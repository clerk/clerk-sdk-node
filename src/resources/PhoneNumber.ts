import type {
  PhoneNumberJSON,
  PhoneNumberResource,
  VerificationResource,
  IdentificationLinkResource,
} from "../types/resources";

import { Verification } from "./Verification";
import { IdentificationLink } from "./IdentificationLink";

export class PhoneNumber implements PhoneNumberResource {
  id: string;
  phoneNumber: string;
  verification: VerificationResource;
  reservedForSecondFactor: boolean;
  linkedTo: Array<IdentificationLinkResource>;

  constructor(data: PhoneNumberJSON) {
    this.id = data.id;
    this.phoneNumber = data.phone_number;
    this.reservedForSecondFactor = data.reserved_for_second_factor;
    this.verification = new Verification(data.verification);

    this.linkedTo = data.linked_to.map((link) => {
      return new IdentificationLink(link);
    });
  }
}

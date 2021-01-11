import type {
  IdentificationLinkJSON,
  IdentificationLinkResource,
} from "../types/resources";

export class IdentificationLink implements IdentificationLinkResource {
  id: string;
  type: string;

  constructor(data: IdentificationLinkJSON) {
    this.id = data.id;
    this.type = data.type;
  }
}
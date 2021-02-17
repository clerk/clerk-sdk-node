import type {
  IdentificationLinkJSON,
  IdentificationLinkResource,
} from "./Base";

export class IdentificationLink implements IdentificationLinkResource {
  id: string;
  type: string;

  constructor(data: IdentificationLinkJSON) {
    this.id = data.id;
    this.type = data.type;
  }
}
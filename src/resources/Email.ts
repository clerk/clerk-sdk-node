import type { EmailJSON, EmailResource } from './Base';

export class Email implements EmailResource {
  id: string;
  fromEmailName: string;
  toEmailAddress: string;
  emailAddressId: string;
  subject: string;
  body: string;
  status: string;

  constructor(data: EmailJSON) {
    this.id = data.id;
    this.fromEmailName = data.from_email_name;
    this.toEmailAddress = data.to_email_address;
    this.emailAddressId = data.email_address_id;
    this.subject = data.subject;
    this.body = data.body;
    this.status = data.status;
  }
}

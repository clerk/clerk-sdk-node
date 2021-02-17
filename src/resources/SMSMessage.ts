import type {
  SMSMessageJSON,
  SMSMessageResource,
} from "./Base";

export class SMSMessage implements SMSMessageResource {
  id: string;
  fromPhoneNumber: string;
  toPhoneNumber: string;
  phoneNumberId: string;
  message: string;
  status: string;

  constructor(data: SMSMessageJSON) {
    this.id = data.id;
    this.fromPhoneNumber = data.phone_number_id;
    this.toPhoneNumber = data.to_phone_number;
    this.phoneNumberId = data.phone_number_id;
    this.message = data.message;
    this.status = data.status;
  }
}

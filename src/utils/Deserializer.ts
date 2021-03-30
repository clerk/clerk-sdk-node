import { ObjectType } from '../resources/JSON';
import { Client } from '../resources/Client';
import { Email } from '../resources/Email';
import { Session } from '../resources/Session';
import { SMSMessage } from '../resources/SMSMessage';
import { User } from '../resources/User';

// FIXME don't return any
export default function deserialize(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => jsonToObject(item));
  } else {
    return jsonToObject(data);
  }
}

// FIXME don't return any
// item must have 'object' key
function jsonToObject(item: any): any {
  switch (item.object) {
    case ObjectType.Client:
      return Client.fromJSON(item);
    case ObjectType.Email:
      return Email.fromJSON(item);
    case ObjectType.User:
      return User.fromJSON(item);
    case ObjectType.Session:
      return Session.fromJSON(item);
    case ObjectType.SmsMessage:
      return SMSMessage.fromJSON(item);
    default:
      console.log(`Unexpected object type: ${item.object}`);
  }
}

import { Client } from '../resources/Client';
import { Email } from '../resources/Email';
import { Session } from '../resources/Session';
import { SMSMessage } from '../resources/SMSMessage';
import { User } from '../resources/User';

// TODO
// Define type / enum for object types we support

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
    case 'client':
      return Client.fromJSON(item);
    case 'email':
      return Email.fromJSON(item);
    case 'user':
      return User.fromJSON(item);
    case 'session':
      return Session.fromJSON(item);
    case 'sms_message':
      return SMSMessage.fromJSON(item);
    default:
      console.log(`Unexpected object type: ${item.object}`);
  }
}

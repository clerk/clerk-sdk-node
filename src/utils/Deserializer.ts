import { Client } from '../resources/Client';
import { Email } from '../resources/Email';
import { Session } from '../resources/Session';
import { SMSMessage } from '../resources/SMSMessage';
import { User } from '../resources/User';

// TODO
// Define type / enum for object types we support

// FIXME don't return any
export default function(data: any): any {
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
      return new Client(item);
    case 'email':
      return new Email(item);
    case 'user':
      return new User(item);
    case 'session':
      return new Session(item);
    case 'sms_message':
      return new SMSMessage(item);
    default:
      console.log(`Unexpected object type: ${item.object}`);
  }
}

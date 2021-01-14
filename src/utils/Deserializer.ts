import { Client } from '../resources/Client';
import { Email } from '../resources/Email';
import { Session } from '../resources/Session';
import { User } from '../resources/User';

// TODO
// Define type / enum for object types we support

// FIXME expect object or array of objects
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
      break;
    case 'email':
      return new Email(item);
      break;
    case 'user':
      return new User(item);
      break;
    case 'session':
      return new Session(item);
      break;
    default:
      console.log(`Unexpected object type: ${item.object}`);
      break;
  }
}

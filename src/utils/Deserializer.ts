import { User } from '../resources/User';

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
    case 'user':
      return new User(item);
      break;
    default:
      console.log(`Unexpected object type: ${item.object}`);
      break;
  }
}

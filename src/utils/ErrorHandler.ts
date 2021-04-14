// Just a pass-through of the error response code & body for no

import { HttpError } from './Errors';

export default function handleError(error: any): never {
  const statusCode = error?.response?.statusCode || 500;
  const message = error.message || '';
  const data = error?.response?.body;

  throw new HttpError(statusCode, message, data);
}

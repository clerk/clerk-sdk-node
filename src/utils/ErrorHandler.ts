// Just a passthrough of the error response body for now
// Final error structure TBD
// TODO also process the error.code for 50X responses

export function handleError(error: any): never {
  throw error.response.body;
}

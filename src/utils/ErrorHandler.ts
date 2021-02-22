// Just a passthrough of the error response body for now
// Final error structure TBD
// TODO also process the error.code for 50X responses

export default function handleError(error: any): never {
  if (error.response && error.response.body) {
    throw error.response.body;
  } else {
    throw error.message;
  }
}

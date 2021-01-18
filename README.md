# Clerk node SDK

Thank you for choosing [Clerk](https://clerk.dev/) for your authentication & user management needs!

This SDK allows you to call the Clerk server API from node / JS / TS code without having to implement the calls yourself.

To gain a better understanding of the underlying API calls the SDK makes, feel free to consult the [official Clerk server API documentation](https://docs.clerk.dev/server-api/).

## Internal implementation details

This project is written in [TypeScript](https://www.typescriptlang.org/) and built with [tsdx](https://github.com/formium/tsdx), thus CJS, ESModules, and UMD module formats are supported.

The http client used by the sdk is [got](https://github.com/sindresorhus/got).

All resource operations are mounted as sub-APIs on a `Clerk` object and return promises that either resolve with their expected resource types or reject with the error types described below.

## Installation

Using yarn:

`yarn add clerk-sdk-node`

Using npm:

`npm install clerk-sdk-node --save`

## Resource types

The following types are of interest to the integrator:

| Resource    | Description                                  |
| ----------- | -------------------------------------------- |
| Client      | unique browser or mobile app instance        |
| Session     | a session for a given user on a given client |
| User        | a person signed up via Clerk                 |
| Email       | an email message sent to another user        |
| SMS Message | an SMS message sent to another user          |

## Usage

Usage with ES modules:

```
import Clerk from "clerk-sdk-node";

const clerk = new Clerk.default("my-clerk-server-api-key");

```

Usage with CommonJS:

```
const Clerk = require('clerk-sdk-node');

const clerk = new Clerk.default("my-clerk-server-api-key");

```

You can also consult the [examples folder](https://www.todo.com) for further hints on usage.

### Client operations

#### getClientList()

Retrieves the list of clients:

```
let clients = await clerk.clientApi.getClientList();
```

#### getClient(clientId)

Retrieves a single clientby its id:

```
const clientID = "my-client-id";
let client = await clerk.clientApi.getClient(clientId);
```

#### verifyClient(sessionToken)

Retrieves a client for a given session token, if the session is active:

```
const sessionToken = "my-session-token";
let client = await clerk.clientApi.verifyClient(sessionToken);
```

### Session operations

#### getSessionList({ clientId, userId })

Retrieves the list of sessions:

```
let sessions = await clerk.sessionApi.getSessionList();
```

Can also be filtered by a given client id, user id, or both:

```
const clientId = "my-client-id";
const userId = "my- user-id";
let sessions = await clerk.sessionApi.getSessionList({ clientId, sessionId });
```

#### getSession(sessionId)

Retrieves a single session by its id:

```
let session = await clerk.sessionApi.getSession(sessionId);
```

#### revokeSession(sessionId)

Revokes a session given its id. User will be signed out from the particular client the referred to:

```
const sessionId = "my-session-id";
let session = await clerk.sessionApi.revokeSession(sessionId);
```

#### verifySession(sessionId, sessionToken)

Verifies whether a session with a given id corresponds to the provided session token:

```
const sessionId = "my-session-id";
const sessionToken = "my-session-token";
let session = await clerk.sessionApi.verifySession(sessionId, sessionToken);
```

### User operations

#### getUserList()

Retrieves user list:

```
let users = await clerk.userApi.getUserList();
```

#### getUser(userId)

Retrieves a single user by their id:

```
const userId = "my-user-id";
const user = await clerk.userApi.getUser(userId);
```

#### updateUser(userId, params)

Updates a user with a given id with attribute values provided in a params object:

```
const userId = "my-user-id";
const params = { firstName = "John", lastName: "Wick" }; // See below for all supported keys
const user = await clerk.userApi.update(userId, params)
```

Supported user attributes for update are:

| Attribute             | Data type |
| --------------------- | --------- |
| firstName             | string    |
| lastName              | string    |
| password              | string    |
| primaryEmailAddressID | string    |
| primaryPhoneNumberID  | string    |

#### deleteUser(userId)

Deletes a user given their id:

```
const userId = "my-user-id";
user = await clerk.userApi.deleteUser(userId);
```

### Email operations

#### createEmail({ fromEmailName, subject, body, emailAddressId })

Sends an email message to an email address id belonging to another user:

```
const fromEmailName = "sales"; // i.e. the "sales" in sales@example.com
const subject = "Free tacos";
const body = "Join us via Zoom for remote Taco Tuesday!";
const emailAddressId = "recipient-email-address-id";
let email = await clerk.emailApi.createEmail({ fromEmailName, subject, body, emailAddressId });
```

### SMS Message operations

#### createSMSMessage({ message, phoneNumberId })

Sends an SMS message to a phone number id belonging to another user:

```
const message = "All glory to the Hypnotoad!";
const phoneNumberId = "recipient-phone-number-id";
let smsMessage = await clerk.smsMessageApi.createSMSMessage({ message, phoneNumberId });
```

## Error handling

TODO

## Express middleware

TODO

## Feedback / Issue reporting

Please open a [github issue](https://github.com/clerkinc/clerk-sdk-node/issues) or contact us on the [official Clerk Slack channel](https://www.todo.com).

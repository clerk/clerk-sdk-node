# Clerk node SDK

Thank you for choosing [Clerk](https://clerk.dev/) for your authentication, session & user management needs!

This SDK allows you to call the Clerk server API from node / JS / TS code without having to implement the calls
yourself.

To gain a better understanding of the underlying API calls the SDK makes, feel free to consult
the [official Clerk server API documentation](https://docs.clerk.dev/server-api/).

## Table of contents

- [Internal implementation details](#internal-implementation-details)
- [Installation](#installation)
- [Resource types](#resource-types)
- [Usage](#usage)
    - [Options & ENV vars available](#options--env-vars-available)
        - [tl;dr](#tldr)
        - [Full option reference](#full-option-reference)
        - [httpOptions](#httpoptions)
    - [Singleton](#singleton)
        - [ESM](#esm)
        - [CJS](#cjs)
        - [Setters](#setters)
    - [Custom instance](#custom-instance)
        - [ESM](#esm-1)
        - [CJS](#cjs-1)
    - [Examples](#examples)
    - [Client operations](#client-operations)
        - [getClientList()](#getclientlist)
        - [getClient(clientId)](#getclientclientid)
        - [verifyClient(sessionToken)](#verifyclientsessiontoken)
    - [Session operations](#session-operations)
        - [getSessionList({ clientId, userId })](#getsessionlist-clientid-userid-)
        - [getSession(sessionId)](#getsessionsessionid)
        - [revokeSession(sessionId)](#revokesessionsessionid)
        - [verifySession(sessionId, sessionToken)](#verifysessionsessionid-sessiontoken)
    - [User operations](#user-operations)
        - [getUserList()](#getuserlist)
        - [getUser(userId)](#getuseruserid)
        - [updateUser(userId, params)](#updateuseruserid-params)
        - [deleteUser(userId)](#deleteuseruserid)
    - [Email operations](#email-operations)
        - [createEmail({ fromEmailName, subject, body, emailAddressId })](#createemail-fromemailname-subject-body-emailaddressid-)
    - [SMS Message operations](#sms-message-operations)
        - [createSMSMessage({ message, phoneNumberId })](#createsmsmessage-message-phonenumberid-)
- [Error handling](#error-handling)
- [Express middleware](#express-middleware)
- [Next](#next)
- [Feedback / Issue reporting](#feedback--issue-reporting)

## Internal implementation details

This project is written in [TypeScript](https://www.typescriptlang.org/) and built
with [tsdx](https://github.com/formium/tsdx).

CJS, ESM, and UMD module builds are provided.

The http client used by the sdk is [got](https://github.com/sindresorhus/got).

All resource operations are mounted as sub-APIs on a `Clerk` class and return promises that either resolve with their
expected resource types or reject with the error types described below.

The sub-APIs are also importable directly if you don't want to go through the `Clerk` class.

## Installation

Using yarn:

`yarn add @clerk/clerk-sdk-node`

Using npm:

`npm install @clerk/clerk-sdk-node --save`

## Resource types

The following types are of interest to the integrator:

| Resource    | Description                                  |
| ----------- | -------------------------------------------- |
| Client      | unique browser or mobile app                 |
| Session     | a session for a given user on a given client |
| User        | a person signed up via Clerk                 |
| Email       | an email message sent to another user        |
| SMS Message | an SMS message sent to another user          |

The following types are not directly manipulable but can be passed as params to applicable calls:

| Resource     | Description                                                           | Usage                                                                             |
| ------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| EmailAddress | email address, a user may have a primary & several secondary          | email address id can be provided to `emails` sub-api to specify the recipient     |
| PhoneNumber  | E.164 telephone number, a user may have a primary & several secondary | phone number id can be provided to `smsMessages` sub-api to specify the recipient |

## Usage

### Options & ENV vars available

#### tl;dr

If you set `CLERK_API_KEY` in your environment you are good to go.

#### Full option reference

The following options are available for you to customize the behaviour of the `Clerk` class.

Note that most options can also be set as ENV vars so that you don't need to pass anything to the constructor or set it
via the available setters.

| Option       | Description                                                        | Default                 | ENV variable        |
| ------------ | ------------------------------------------------------------------ | ----------------------- | ------------------- |
| apiKey       | server key for api.clerk.dev                                       | none                    | `CLERK_API_KEY`     |
| apiVersion   | for future use, v1 for now                                         | "v1"                    | `CLERK_API_VERSION` |
| serverApiURL | for debugging / future use                                         | "https://api.clerk.dev" | `CLERK_API_URL`     |
| httpOptions  | [http client options](https://github.com/sindresorhus/got#options) | {}                      | N/A                 |

For every option the resolution is as follows, in order of descending precedence:

1. option passed
2. ENV var (if applicable)
3. default

#### httpOptions

The SDK allows you to pass options to the underlying http client (got) by instantiating it with an
additional `httpOptions` object.

e.g. to pass a custom header:

```
sdk = new Clerk(apiKey, { httpOptions: headers: {
		'x-unicorn': 'rainbow'
	} })
```

You can check the options the got client supports [here](https://github.com/sindresorhus/got#options).

### Singleton

If you are comfortable with setting the `CLERK_API_KEY` ENV variable and be done with it, the default instance created
by the SDK will suffice for your needs.

#### ESM

```
import clerk from "@clerk/clerk-sdk-node";
cons userList = await clerk.users.getUserList();
```

Or if you are interested only in a certain resource:

```
import { sessions } from "@clerk/clerk-sdk-node";
cons sessionList = await sessions.getSessionList();
```

#### CJS

```
const pkg = require('@clerk/clerk-sdk-node');
const clerk = pkg.default;

clerk.emails
  .createEmail({ fromEmailName, subject, body, emailAddressId })
  .then(email => console.log(email))
  .catch(error => console.error(error));
```

Or if you prefer a resource sub-api directly:

```
const pkg = require('@clerk/clerk-sdk-node');
const { clients } = pkg;

clients.getClient(clientId)
  .then(client => console.log(client))
  .catch(error => console.error(error));
```

#### Setters

The following setters are avaible for you to change the options even after you've obtained a handle on a `Clerk` or
sub-api instance:

If you have a `clerk` handle:

- `clerk.apiKey = value`;
- `clerk.serverApiUrl = value`;
- `clerk.apiVersion = value`;
- `clerk.httpOptions = value`;

If are using a sub-api handle and wish to change options on the (implicit) singleton `Clerk` instance:

- `setClerkApiKey(value)`
- `setClerkServerApiUrl(value)`
- `setClerkApiVersion(value)`
- `setClerkHttpOptions(calue)`

### Custom instantiation

If you would like to use more than one `Clerk` instance, e.g. if you are using multiple api keys or simply prefer the
warm fuzzy feeling of controlling instantiation yourself:

#### ESM

```
import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = new Clerk({ apiKey: "top-secret" });

const clientList = await clerk.clients.getClientList();
```

#### CJS

```
const pkg = require('@clerk/clerk-sdk-node');
const { Clerk } = pkg;

const clerk = new Clerk({ apiKey: "your-eyes-only" });

clerk.smsMessages
  .createSMSMessage({ message, phoneNumberId })
  .then(smsMessage => console.log(smsMessage)).
  .catch(error => console.error(error));
```

### Examples

You also consult the [examples folder](https://github.com/clerkinc/clerk-sdk-node/tree/main/examples) for further hints
on usage.

### Client operations

Client operations are exposed by the `clients` sub-api (`clerk.clients`).

#### getClientList()

Retrieves the list of clients:

```
const clients = await clerk.clients.getClientList();
```

#### getClient(clientId)

Retrieves a single client by its id:

```
const clientID = "my-client-id";
const client = await clerk.clients.getClient(clientId);
```

#### verifyClient(sessionToken)

Retrieves a client for a given session token, if the session is active:

```
const sessionToken = "my-session-token";
const client = await clerk.clients.verifyClient(sessionToken);
```

### Session operations

Session operations are exposed by the `sessions` sub-api (`clerk.sessions`).

#### getSessionList({ clientId, userId })

Retrieves the list of sessions:

```
const sessions = await clerk.sessions.getSessionList();
```

Can also be filtered by a given client id, user id, or both:

```
const clientId = "my-client-id";
const userId = "my- user-id";
const sessions = await clerk.sessions.getSessionList({ clientId, sessionId });
```

#### getSession(sessionId)

Retrieves a single session by its id:

```
const session = await clerk.sessions.getSession(sessionId);
```

#### revokeSession(sessionId)

Revokes a session given its id. User will be signed out from the particular client the referred to:

```
const sessionId = "my-session-id";
let session = await clerk.sessions.revokeSession(sessionId);
```

#### verifySession(sessionId, sessionToken)

Verifies whether a session with a given id corresponds to the provided session token:

```
const sessionId = "my-session-id";
const sessionToken = "my-session-token";
let session = await clerk.sessions.verifySession(sessionId, sessionToken);
```

### User operations

User operations are exposed by the `users` sub-api (`clerk.users`).

#### getUserList()

Retrieves user list:

```
let users = await clerk.users.getUserList();
```

#### getUser(userId)

Retrieves a single user by their id:

```
const userId = "my-user-id";
const user = await clerk.users.getUser(userId);
```

#### updateUser(userId, params)

Updates a user with a given id with attribute values provided in a params object:

```
const userId = "my-user-id";
const params = { firstName = "John", lastName: "Wick" }; // See below for all supported keys
const user = await clerk.users.update(userId, params)
```

Supported user attributes for update are:

| Attribute             | Data type               |
| :-------------------: | :---------------------: |
| firstName             | string                  |
| lastName              | string                  |
| password              | string                  |
| primaryEmailAddressID | string                  |
| primaryPhoneNumberID  | string                  |
| publicMetadata        | Record<string, unknown> |
| privateMetadata       | Record<string, unknown> |

#### deleteUser(userId)

Deletes a user given their id:

```
const userId = "my-user-id";
user = await clerk.users.deleteUser(userId);
```

### Email operations

Email operations are exposed by the `emails` sub-api (`clerk.emails`).

#### createEmail({ fromEmailName, subject, body, emailAddressId })

Sends an email message to an email address id belonging to another user:

```
const fromEmailName = "sales"; // i.e. the "sales" in sales@example.com
const subject = "Free tacos";
const body = "Join us via Zoom for remote Taco Tuesday!";
const emailAddressId = "recipient-email-address-id";
let email = await clerk.emails.createEmail({ fromEmailName, subject, body, emailAddressId });
```

### SMS Message operations

SMS message operations are exposed by the `smsMessages` sub-api (`clerk.smsMessages`).

#### createSMSMessage({ message, phoneNumberId })

Sends an SMS message to a phone number id belonging to another user:

```
const message = "All glory to the Hypnotoad!";
const phoneNumberId = "recipient-phone-number-id";
let smsMessage = await clerk.smsMessages.createSMSMessage({ message, phoneNumberId });
```

## Error handling

The error handling is pretty generic at the moment but more fine grained errors are coming soon ™.

## Express middleware

For usage with [Express](https://github.com/expressjs/express), this package also exports a `ClerkExpressMiddleware`
function that can be used in the standard manner:

```
import { ClerkExpressMiddleware } from 'sdk-server-node';

// Initialize express app the usual way

const options = {
    onError: function() {} // Function to call if the middleware encounters or fails to authenticate, can be used to provide logging etc
};

app.use(ClerkExpressMiddleware(options));
```

The middleware will set the Clerk session on the request object as `req.session` and simply call the next middleware.

You can then implement your own logic for handling a logged in or logged out user in your express endpoints or custom
middleware, depending on whether they are trying to access a public or protected resource.

If you want to use the express middleware of your custom `Clerk` instance, you can use:

```
app.use(clerk.expressMiddleware(options));
```

Where `clerk` is your own instance.

## Next

The current package also offers a way of making
your [Next.js api middleware](https://nextjs.org/docs/api-routes/api-middlewares) aware of the Clerk Session.

You can define your handler function with the usual signature (`function handler(req, res) {}`) then wrap it
with `withSession`:

```
import { withSession, WithSessionProp } from '@clerk/clerk-sdk-node';
```

Note: Since the request will be extended with a session property, the signature of your handler in TypeScript would be:

```
function handler(req WithSessionProp<NextApiRequest>, res: NextApiResponse) {
    if (req.session) {
        // do something with session.userId
    } else {
        // Respond with 401 or similar
    }
}

export withSession(handler);
```

You can also pass an `onError` handler to the underlying Express middleware that is called (see previous section):

```
export withSession(handler, { clerk, onError: error => console.log(error) });
```

In case you would like the request to be rejected with a 401 (Unauthorized) automatically when no session exists,
without having to implement such logic yourself, you can opt for the stricter variant:

```
import clerk, { requireSession, RequireSessionProp } from '@clerk/clerk-sdk-node';
```

In this case your handler can be even simpler because the existence of the session can be assumed, otherwise the
execution will never reach your handler:

```
function handler(req RequireSessionProp<NextApiRequest>, res: NextApiResponse) {
    // do something with session.userId
}

export requireSession(handler, { clerk, onError });
```

The aforementioned usage pertains to the singleton case. If you would like to use a `Clerk` instance you instantiated
yourself (e.g. named `clerk`), you can use the following syntax instead:

```
export clerk.withSession(handler);
// OR
export clerk.requireSession(handler);
```

## Feedback / Issue reporting

Please report issues or open feauture request in
the [github issue section](https://github.com/clerkinc/clerk-sdk-node/issues).

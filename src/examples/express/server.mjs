// Usage:
// node --require dotenv/config server.mjs

import express from 'express';
import clerk, { ClerkExpressMiddleware } from '@clerk/clerk-sdk-node';

const serverApiUrl = process.env.CLERK_API_URL;
const port = process.env.PORT;

function onError(error) {
  console.log(error);
}

clerk.serverApiUrl = serverApiUrl;

var app = express();

app.use(ClerkExpressMiddleware({ clerk, onError }));

app.get('/', (req, res) => {
  res.json(req.session);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

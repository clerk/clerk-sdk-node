// Usage:
// node --require dotenv/config server.mjs

import express from 'express';
import { ClerkExpressWithSession, ClerkExpressRequireSession } from '@clerk/clerk-sdk-node';

const port = process.env.PORT;

var app = express();

function errorHandler (err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const body = err.data || { error: err.message };

  res
      .status(statusCode)
      .json(body);
}

// Root path uses lax middleware
app.get('/', ClerkExpressWithSession(), (req, res) => {
  res.json(req.session);
});

// /require-session path uses strict middleware
app.get('/require-session', ClerkExpressRequireSession(), (req, res) => {
  res.json(req.session);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(errorHandler);

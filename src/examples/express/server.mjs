import express from 'express';
import { ExpressAuthMiddleware } from 'clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.CLERK_API_KEY;
const serverApiUrl = process.env.CLERK_API_URL;
const port = process.env.PORT;

function onError(error) {
  console.log(error);
}

var app = express();

app.use(ExpressAuthMiddleware(apiKey, { serverApiUrl, onError }));

app.get('/', (req, res) => {
  res.json(req.session);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

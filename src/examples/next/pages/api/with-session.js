const { withSession } = require('clerk-sdk-node');

function handler(req, res) {
    console.log('Session optional');
    res.statusCode = 200;
    res.json(req.session || { empty: true });
}

export default withSession(handler, { serverApiUrl: process.env.CLERK_API_URL, onError: error => console.log(error) });

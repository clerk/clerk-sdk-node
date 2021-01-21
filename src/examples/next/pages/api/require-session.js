const { requireSession } = require('@clerk/clerk-sdk-node');

function handler(req, res) {
    console.log('Session required');
    res.statusCode = 200;
    res.json(req.session || { empty: true });
}

export default requireSession(handler, { serverApiUrl: process.env.CLERK_API_URL, onError: error => console.log(error) });

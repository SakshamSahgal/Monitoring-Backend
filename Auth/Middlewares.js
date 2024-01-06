const jwt = require('jsonwebtoken');


//middleware to check if token is valid

function hasAccess(req, res, next) {
    let token = req.headers['authorization']
    console.log('Token:', token);
    if (token) {
        try {
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('Decoded:', decoded);
            req.decoded = decoded;  // save to request for use in other routes
            next();
        } catch (err) {
            console.error(err);
            res.json({
                success: false,
                message: "Invalid token"
            })
        }
    } else {
        res.json({
            success: false,
            message: "No token provided"
        })
    }
}

module.exports = { hasAccess };
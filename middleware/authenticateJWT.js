const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }
    console.log(token);
    console.log(process.env.JWT_SECRET);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.sendStatus(403);
        }
        
        req.userId = decoded.userId; 

        next();
    });
};

module.exports = authenticateJWT;
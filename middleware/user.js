const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: Bearer <token>
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    try {
        const decodedToken = jwt.verify(token, 'your_secret_Key');
        req.user = { userId: decodedToken.userId };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

const jwt = require('jsonwebtoken');

function blockAccessMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Access denied. Invalid token format.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Simpan informasi user dari token
        next();
    } catch (err) {
        res.status(403).json({ message: 'Access denied. Invalid token.' });
    }
}

module.exports = blockAccessMiddleware;

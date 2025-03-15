// middlewares/blockUnauthorizedAccess.js
module.exports = (req, res, next) => {

    // Skip middleware untuk endpoint gambar
    if (req.path.includes('/image')) {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (authHeader === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};
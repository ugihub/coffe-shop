// middlewares/blockUnauthorizedAccess.js
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
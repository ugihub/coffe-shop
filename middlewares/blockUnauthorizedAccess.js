function checkPasswordMiddleware(req, res, next) {
    const adminPassword = req.headers.authorization; // Ambil sandi dari header

    if (!adminPassword) {
        return res.status(403).json({ message: 'Access denied. No password provided.' });
    }

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ message: 'Access denied. Invalid password.' });
    }

    next(); // Jika sandi benar, lanjutkan ke route berikutnya
}

module.exports = checkPasswordMiddleware;

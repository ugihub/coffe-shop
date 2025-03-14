function checkPasswordMiddleware(req, res, next) {
    const adminPassword = req.headers.authorization; // Ambil password dari header

    if (!adminPassword) {
        console.error('No authorization header provided');
        return res.status(403).json({ message: 'Access denied. No password provided.' });
    }

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        console.error(`Invalid password: ${adminPassword}`);
        return res.status(403).json({ message: 'Access denied. Invalid password.' });
    }

    console.log('Password accepted:', adminPassword); // Logging password yang diterima
    next(); // Jika password benar, lanjutkan ke route berikutnya
}

module.exports = checkPasswordMiddleware;

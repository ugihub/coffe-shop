function blockUnauthorizedAccess(req, res, next) {
    const secretKey = req.headers['x-admin-secret']; // Ambil kode rahasia dari header

    if (secretKey !== 'YOUR_SECRET_KEY') { // Ganti YOUR_SECRET_KEY dengan kode rahasia Anda
        return res.status(403).json({ message: 'Access denied. You are not authorized to view this page.' });
    }

    next(); // Jika kode rahasia cocok, lanjutkan ke handler berikutnya
}

module.exports = blockUnauthorizedAccess;

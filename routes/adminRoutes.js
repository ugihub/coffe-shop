const express = require('express');
const multer = require('multer');
const router = express.Router();
const blockUnauthorizedAccess = require('../middlewares/blockUnauthorizedAccess');
const Product = require('../models/productModels');

// Terapkan middleware di semua route admin
router.use(blockUnauthorizedAccess);

// Pastikan route verifikasi password tidak terproteksi middleware
router.post('/verify-password', (req, res) => {
    const { password } = req.body;

    // Tambahkan log untuk debugging
    console.log('Received password:', password);
    console.log('Expected password:', process.env.ADMIN_PASSWORD);

    if (password === process.env.ADMIN_PASSWORD) {
        res.sendStatus(200);
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// Middleware otentikasi untuk route lain
router.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// Konfigurasi Multer dengan validasi
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Format gambar tidak didukung');
        error.code = 'INVALID_FILE_TYPE';
        return cb(error);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Endpoint untuk menambahkan produk
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description } = req.body;

        // Validasi input tambahan
        if (!name || name.trim().length < 3) {
            return res.status(400).json({ error: 'Nama minimal 3 karakter' });
        }

        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            return res.status(400).json({ error: 'Harga harus angka positif' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Gambar wajib diupload' });
        }

        const newProduct = new Product({
            name: name.trim(),
            price: parseFloat(price),
            description: description?.trim(),
            image: req.file.buffer,
            imageType: req.file.mimetype
        });

        await newProduct.save();
        res.status(201).json({
            message: 'Produk berhasil ditambahkan',
            product: {
                _id: newProduct._id,
                name: newProduct.name,
                price: newProduct.price,
                description: newProduct.description,
                imageUrl: `/api/admin/products/${newProduct._id}/image`
            }
        });
    } catch (err) {
        if (err.code === 'INVALID_FILE_TYPE') {
            return res.status(400).json({ error: err.message });
        }
        if (err.message.includes('File too large')) {
            return res.status(400).json({ error: 'Ukuran gambar maksimal 5MB' });
        }
        console.error('Error tambah produk:', err);
        res.status(500).json({ error: 'Gagal menambahkan produk' });
    }
});

// Endpoint untuk mendapatkan daftar produk
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});

        res.json(products.map(product => ({
            _id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            imageUrl: `/api/admin/products/${product._id}/image`
        })));
    } catch (err) {
        console.error('Error ambil produk:', err);
        res.status(500).json({ error: 'Gagal mengambil data produk' });
    }
});

// Endpoint untuk mendapatkan gambar produk
router.get('/products/:id/image', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || !product.image) {
            return res.status(404).json({ error: 'Gambar tidak ditemukan' });
        }

        res.contentType(product.imageType);
        res.send(product.image);
    } catch (err) {
        console.error('Error ambil gambar:', err);
        res.status(500).json({ error: 'Gagal mengambil gambar' });
    }
});

// Endpoint untuk menghapus produk
router.delete('/products/:id', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }
        res.json({ message: 'Produk berhasil dihapus' });
    } catch (err) {
        console.error('Error hapus produk:', err);
        res.status(500).json({ error: 'Gagal menghapus produk' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/productModels');

// Konfigurasi multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Verifikasi password route (PUBLIC)
router.post('/verify-password', (req, res) => {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        res.sendStatus(200);
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// Middleware otentikasi untuk route selanjutnya
router.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// Route admin yang diproteksi
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const newProduct = new Product({
            name,
            price,
            description,
            image: req.file.buffer,
            imageType: req.file.mimetype
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().lean(); // Pastikan data jadi plain object
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware otentikasi untuk semua route kecuali gambar
router.use((req, res, next) => {
    // Pengecualian untuk endpoint gambar
    if (req.path.includes('/image')) {
        return next();
    }

    // Validasi password untuk route lain
    const authHeader = req.headers.authorization;

    if (authHeader === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// Endpoint gambar tetap tidak terproteksi
router.get('/products/:id/image', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        console.log('Product:', product);

        if (!product) {
            console.log('Product not found');
            return res.redirect('/placeholder.jpg');
        }

        if (!product.image) {
            console.log('Image data not found');
            return res.redirect('/placeholder.jpg');
        }

        res.contentType(product.imageType);
        res.send(product.image);
    } catch (err) {
        console.error('Image error:', err.message);
        res.redirect('/placeholder.jpg');
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Product = require('../models/productModels'); // Import model

// Route untuk mendapatkan semua produk
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // Mengambil semua produk dari DB
        res.json(products); // Mengembalikan data dalam format JSON
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

module.exports = router;

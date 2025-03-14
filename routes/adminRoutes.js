const express = require('express');
const router = express.Router();
const blockUnauthorizedAccess = require('../middlewares/blockUnauthorizedAccess');
const Product = require('../models/productModels');

// Terapkan middleware di semua route admin
router.use(blockUnauthorizedAccess);

// Endpoint untuk mendapatkan semua produk
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // Harus mengembalikan array
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// Endpoint untuk menambahkan produk
router.post('/products', async (req, res) => {
    const { name, price, description } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    try {
        const newProduct = new Product({ name, price, description });
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (err) {
        console.error('Error adding product:', err.message);
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// Endpoint untuk menghapus produk
router.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

module.exports = router;

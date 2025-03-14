const express = require('express');
const multer = require('multer');
const router = express.Router();
const blockUnauthorizedAccess = require('../middlewares/blockUnauthorizedAccess');
const Product = require('../models/productModels');

// Terapkan middleware di semua route admin
router.use(blockUnauthorizedAccess);

// Konfigurasi Multer untuk meng-upload file ke memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint untuk menambahkan produk
router.post('/products', upload.single('image'), async (req, res) => {
    const { name, price, description } = req.body;

    if (!name || !price || !req.file) {
        return res.status(400).json({ message: 'Name, price, and image are required' });
    }

    try {
        const newProduct = new Product({
            name,
            price,
            description,
            image: req.file.buffer, // Simpan gambar sebagai binary
            imageType: req.file.mimetype // Simpan MIME type
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (err) {
        console.error('Error adding product:', err.message);
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// Endpoint untuk mendapatkan daftar produk dan gambar
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        console.log('Products fetched:', products); // Debug log

        res.json(products.map(product => ({
            _id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            // Konversi binary ke Base64
            image: product.image
                ? `data:${product.imageType};base64,${product.image.toString('base64')}` // Base64 format
                : null
        })));
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Failed to fetch products' });
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

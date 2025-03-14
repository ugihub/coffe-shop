require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Untuk file frontend seperti index.html

// Variabel lingkungan dari .env
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Koneksi ke MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB:', err.message);
    });

// Routes
app.use('/api', productRoutes); // Prefix "api" untuk route produk
app.use('/api', orderRoutes); // Prefix "api" untuk route pesanan
app.use('/api/admin', adminRoutes); // Prefix /api/admin untuk route admin

// Debugging tambahan
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/Admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

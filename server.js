const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Ambil variabel lingkungan dari .env
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Fungsi debugging untuk koneksi MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB:', err.message);
    });

// Debugging untuk port
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Tes route untuk memastikan server berjalan
app.get('/', (req, res) => {
    res.send('Hello, Coffee Shop!');
});

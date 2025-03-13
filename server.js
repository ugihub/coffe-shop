const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Koneksi ke MongoDB Atlas
mongoose.connect('YOUR_MONGODB_URI', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.log('Error:', err));

// Route contoh
app.get('/', (req, res) => res.send('Hello, Coffee Shop!'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

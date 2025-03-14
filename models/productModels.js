const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: Buffer }, // Field untuk menyimpan gambar sebagai binary data
    imageType: { type: String } // Simpan tipe file gambar (MIME Type)
});

module.exports = mongoose.model('Product', productSchema);

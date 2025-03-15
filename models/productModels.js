const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: Buffer,
    imageType: String
}, {
    toJSON: { virtuals: true }, // Pastikan virtuals di-include
    toObject: { virtuals: true }
});

productSchema.virtual('imageUrl').get(function () {
    return `/api/admin/products/${this._id}/image`;
});

module.exports = mongoose.model('Product', productSchema);
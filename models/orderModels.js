const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    status: { type: String, default: 'In Cart' }
});

module.exports = mongoose.model('Order', orderSchema);

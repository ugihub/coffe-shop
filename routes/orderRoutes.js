const express = require('express');
const router = express.Router();
const Order = require('../models/orderModels');

// Endpoint untuk menambahkan order ke keranjang
router.post('/orders', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const order = new Order({
            productId,
            quantity
        });

        await order.save();
        res.json({ message: 'Order added to cart successfully!', order });
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ message: 'Failed to create order' });
    }
});

// Endpoint untuk mendapatkan semua order di keranjang
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'In Cart' }).populate('productId');
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Order = require('../models/orderModels');

// Endpoint untuk melihat order ke keranjang
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'In Cart' }).populate('productId'); // Mengisi detail dari productId
        res.json(orders); // Mengembalikan data lengkap dengan detail produk
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Endpoint untuk menambahkan order ke keranjang
router.post('/orders', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const order = new Order({
            productId,
            quantity
        });

        await order.save();
        res.status(201).json({ message: 'Order added to cart successfully!', order });
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ message: 'Failed to create order' });
    }
});

// Endpoint untuk memperbarui atau membatalkan pesanan
router.put('/orders/:id', async (req, res) => {
    try {
        const { quantity } = req.body; // Ambil quantity dari body request
        const orderId = req.params.id;

        if (quantity <= 0) {
            // Jika quantity 0 atau kurang, hapus pesanan
            await Order.findByIdAndDelete(orderId);
            return res.json({ message: 'Order removed from cart' });
        }

        // Jika quantity lebih dari 0, perbarui data pesanan
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { quantity }, { new: true });
        res.json({ message: 'Order quantity updated', updatedOrder });
    } catch (err) {
        console.error('Error updating order:', err.message);
        res.status(500).json({ message: 'Failed to update order' });
    }
});

module.exports = router;

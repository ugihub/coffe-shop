const express = require('express');
const router = express.Router();

// Contoh route untuk membuat pesanan
router.post('/orders', (req, res) => {
    const order = req.body;
    res.json({ message: 'Order created successfully', order });
});

module.exports = router;

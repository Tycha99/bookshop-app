const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../models/db');

// Список заказов текущего пользователя
router.get('/', requireAuth, async (req, res) => {
    const userId = req.session.user.id;
    try {
        const [orders] = await db.query(`
            SELECT o.id, o.created_at, 
                   SUM(oi.quantity) as total_items
            FROM orders o 
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [userId]);
        res.render('orders', { orders });
    } catch (error) {
        res.status(500).send('Ошибка при получении заказов: ' + error.message);
    }
});

module.exports = router;

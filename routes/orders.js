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
// Детали одного заказа
router.get('/:id', requireAuth, async (req, res) => {
    const userId = req.session.user.id;
    const orderId = parseInt(req.params.id);
    // Проверяем, принадлежит ли заказ пользователю
    const [orders] = await db.query(
        'SELECT * FROM orders WHERE id=? AND user_id=?',
        [orderId, userId]
    );
    if (!orders.length) {
        return res.status(404).send('Заказ не найден');
    }
    // Получаем книги
    const [items] = await db.query(`
        SELECT b.title, b.author, b.price, oi.quantity
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        WHERE oi.order_id = ?`, [orderId]);
    res.render('orderDetails', { order: orders[0], items });
});

// Детали одного заказа
router.get('/:id', requireAuth, async (req, res) => {
    const userId = req.session.user.id;
    const orderId = parseInt(req.params.id);
    // Проверяем, принадлежит ли заказ пользователю
    const [orders] = await db.query(
        'SELECT * FROM orders WHERE id=? AND user_id=?',
        [orderId, userId]
    );
    if (!orders.length) {
        return res.status(404).send('Заказ не найден');
    }
    // Получаем книги
    const [items] = await db.query(`
        SELECT b.title, b.author, b.price, oi.quantity
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        WHERE oi.order_id = ?`, [orderId]);
    res.render('orderDetails', { order: orders[0], items });
});

module.exports = router;

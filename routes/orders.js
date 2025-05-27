const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const db = require('../models/db');

// 1) Просмотр своих заказов (только авторизованный покупатель)
router.get('/', requireAuth, async (req, res) => {
    const userId = req.session.user.id;
    try {
        const [orders] = await db.query(`
            SELECT o.id,
                   o.created_at,
                   o.status,
                   SUM(oi.quantity) AS total_items
            FROM orders o
                     JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [userId]);
        res.render('orders', { orders });
    } catch (err) {
        res.status(500).send('Ошибка при получении ваших заказов: ' + err.message);
    }
});

// 2) Просмотр всех заказов (админ)
router.get('/all', requireRole('admin'), async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.id,
                   o.created_at,
                   o.status,
                   u.username,
                   SUM(oi.quantity) AS total_items
            FROM orders o
                     JOIN users u         ON o.user_id   = u.id
                     JOIN order_items oi  ON o.id        = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);
        res.render('ordersAll', { orders });
    } catch (err) {
        res.status(500).send('Ошибка при получении всех заказов: ' + err.message);
    }
});

// 3) Отменить заказ (админ)
router.post('/all/cancel/:id', requireRole('admin'), async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', id]);
        res.redirect('/orders/all');
    } catch (err) {
        res.status(500).send('Ошибка при отмене заказа: ' + err.message);
    }
});

// 4) Завершить заказ (админ)
router.post('/all/complete/:id', requireRole('admin'), async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', ['completed', id]);
        res.redirect('/orders/all');
    } catch (err) {
        res.status(500).send('Ошибка при завершении заказа: ' + err.message);
    }
});

// 5) Детали заказа (только свои)
router.get('/:id', requireAuth, async (req, res) => {
    const userId  = req.session.user.id;
    const orderId = parseInt(req.params.id, 10);
    try {
        // Проверяем, что заказ принадлежит пользователю
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );
        if (!orders.length) {
            return res.status(404).send('Заказ не найден');
        }
        // Загружаем позиции
        const [items] = await db.query(`
            SELECT b.title,
                   b.author,
                   b.price,
                   b.image,
                   oi.quantity
            FROM order_items oi
                     JOIN books b       ON oi.book_id = b.id
            WHERE oi.order_id = ?
        `, [orderId]);
        res.render('orderDetails', { order: orders[0], items });
    } catch (err) {
        res.status(500).send('Ошибка при получении деталей заказа: ' + err.message);
    }
});

module.exports = router;

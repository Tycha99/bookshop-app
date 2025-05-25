const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Book = require('../models/book');

// Добавить книгу в корзину
router.post('/add', requireAuth, async (req, res) => {
    if (!req.session.cart) req.session.cart = [];
    const bookId = parseInt(req.body.bookId);
    // Проверяем, есть ли книга уже в корзине
    const item = req.session.cart.find(item => item.bookId === bookId);
    if (item) {
        item.quantity += 1;
    } else {
        req.session.cart.push({ bookId, quantity: 1 });
    }
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.sendStatus(200);
    }
    res.redirect('/cart')
});

// Показать корзину
router.get('/', requireAuth, async (req, res) => {
    const cart = req.session.cart || [];
    // Получить данные о книгах из БД
    let booksInCart = [];
    if (cart.length > 0) {
        const ids = cart.map(item => item.bookId);
        const [rows] = await Book.getBooksByIds(ids);
        booksInCart = rows.map(book => {
            const item = cart.find(i => i.bookId === book.id);
            return { ...book, quantity: item.quantity };
        });
    }
    res.render('cart', { books: booksInCart });
});

// Оформить заказ
router.post('/checkout', requireAuth, async (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect('/cart');
    const userId = req.session.user.id;
    const db = require('../models/db');
    try {
        const [orderResult] = await db.query('INSERT INTO orders (user_id) VALUES (?)', [userId]);
        const orderId = orderResult.insertId;
        for (const item of cart) {
            await db.query(
                'INSERT INTO order_items (order_id, book_id, quantity) VALUES (?, ?, ?)',
                [orderId, item.bookId, item.quantity]
            );
        }
        req.session.cart = []; // Очищаем корзину
        res.redirect('/orders');
    } catch (err) {
        res.status(500).send('Ошибка при оформлении заказа: ' + err.message);
    }
});
// Удалить одну позицию из корзины
router.post('/remove', requireAuth, (req, res) => {
    const bookId = parseInt(req.body.bookId);
    req.session.cart = (req.session.cart || []).filter(item => item.bookId !== bookId);
    res.redirect('/cart');
});

module.exports = router;

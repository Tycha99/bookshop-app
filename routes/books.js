const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireRoles } = require('../middleware/auth');
const Book = require('../models/book');

// AJAX-поиск
router.get('/search', async (req, res) => {
    const q = req.query.q || '';
    try {
        const books = await Book.searchBooksByTitle(q);
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка поиска: ' + err.message });
    }
});

// CRUD книг
router.get('/', bookController.list);
router.get('/add', requireRoles(['admin', 'seller']), bookController.showAddForm);
router.post('/add', requireRoles(['admin', 'seller']), bookController.addBook);
// Удаление книги — seller и admin
router.post('/delete/:id', requireRoles(['admin', 'seller']), bookController.deleteBook);

module.exports = router;

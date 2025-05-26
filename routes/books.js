const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireRoles } = require('../middleware/auth');
const Book = require('../models/book');

// Настройка хранилища для загрузки обложек
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// AJAX-поиск по названию книги
router.get('/search', async (req, res) => {
    const q = req.query.q || '';
    try {
        const books = await Book.searchBooksByTitle(q);
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка поиска: ' + err.message });
    }
});

// Список книг
router.get('/', bookController.list);

// Форма добавления (admin и seller)
router.get('/add', requireRoles(['admin', 'seller']), bookController.showAddForm);

// Обработка добавления с загрузкой обложки
router.post(
    '/add',
    requireRoles(['admin', 'seller']),
    upload.single('image'),
    bookController.addBook
);

// Удаление книги (admin и seller)
router.post('/delete/:id', requireRoles(['admin', 'seller']), bookController.deleteBook);

module.exports = router;

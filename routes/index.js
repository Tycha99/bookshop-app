const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Главная страница с каталогом
router.get('/', async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.render('index', { books });
    } catch (error) {
        res.status(500).send('Ошибка при получении каталога: ' + error.message);
    }
});

module.exports = router;

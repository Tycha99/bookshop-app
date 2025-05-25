const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.render('index', { books }); // <-- передаем books в шаблон
    } catch (error) {
        res.status(500).send('Ошибка при получении каталога: ' + error.message);
    }
});

module.exports = router;

const Book = require('../models/book');

exports.list = async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.render('catalog', { books });
    } catch (error) {
        res.status(500).send('Ошибка при получении списка книг: ' + error.message);
    }
};

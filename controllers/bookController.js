const Book = require('../models/book');

exports.list = async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.render('catalog', { books });
    } catch (error) {
        res.status(500).send('Ошибка при получении списка книг: ' + error.message);
    }
};

exports.showAddForm = (req, res) => {
    res.render('addBook', { error: null });
};

exports.addBook = async (req, res) => {
    const { title, author, price, description } = req.body;
    if (!title || !author || !price) {
        return res.render('addBook', { error: 'Заполните все обязательные поля!' });
    }
    try {
        await Book.addBook(title, author, price, description || '');
        res.redirect('/books');
    } catch (err) {
        res.render('addBook', { error: 'Ошибка при добавлении книги: ' + err.message });
    }
};

exports.deleteBook = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await Book.deleteBook(id);
        res.redirect('/books');
    } catch (err) {
        res.status(500).send('Ошибка при удалении книги: ' + err.message);
    }
};

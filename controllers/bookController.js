const Book = require('../models/book');
const path = require('path');

// показать форму
exports.showAddForm = (req, res) => {
    res.render('addBook', { error: null });
};

// добавить книгу
exports.addBook = async (req, res) => {
    const { title, author, price, description } = req.body;
    if (!title || !author || !price) {
        return res.render('addBook', { error: 'Заполните все обязательные поля!' });
    }
    // если файл загрузился, multer положил его в req.file
    const image = req.file ? req.file.filename : null;
    try {
        await Book.addBook(title, author, price, description || '', image);
        res.redirect('/books');
    } catch (err) {
        res.render('addBook', { error: 'Ошибка при добавлении книги: ' + err.message });
    }
};

// удалить книгу
exports.deleteBook = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        await Book.deleteBook(id);
        res.redirect('/books');
    } catch (err) {
        res.status(500).send('Ошибка при удалении книги: ' + err.message);
    }
};

// список
exports.list = async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.render('catalog', { books });
    } catch (err) {
        res.status(500).send('Ошибка при получении списка книг: ' + err.message);
    }
};

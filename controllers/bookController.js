const Book = require('../models/book');
const path = require('path');
const db   = require('../models/db');
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
// Показать форму редактирования цены
exports.showEditPrice = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).send('Некорректный ID книги');
    }

    try {
        const [rows] = await db.query(
            'SELECT id, title, price FROM books WHERE id = ?',
            [id]
        );
        if (!rows.length) {
            return res.status(404).send('Книга не найдена');
        }
        res.render('editPrice', { book: rows[0] });
    } catch (err) {
        res.status(500).send('Ошибка при загрузке книги: ' + err.message);
    }
};

// Сохранить новую цену
exports.updatePrice = async (req, res) => {
    const id    = parseInt(req.params.id, 10);
    const price = parseFloat(req.body.price);

    if (isNaN(id)) {
        return res.status(400).send('Некорректный ID книги');
    }
    if (isNaN(price) || price < 0) {
        return res.status(400).send('Некорректная цена');
    }

    try {
        await db.query(
            'UPDATE books SET price = ? WHERE id = ?',
            [price, id]
        );
        res.redirect('/books');
    } catch (err) {
        res.status(500).send('Ошибка при сохранении цены: ' + err.message);
    }
};
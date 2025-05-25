const Book = require('../models/book');

exports.list = async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.render('catalog', { books });
    } catch (error) {
        res.status(500).send('Ошибка при получении списка книг: ' + error.message);
    }
};

// Показать форму добавления книги
exports.showAddForm = (req, res) => {
    res.render('addBook', { error: null });
};

// Обработать добавление книги
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

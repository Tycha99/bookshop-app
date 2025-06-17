require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const authRouter  = require('./routes/auth');
const booksRouter = require('./routes/books');
const cartRouter  = require('./routes/cart');
const ordersRouter= require('./routes/orders');
const mainRouter  = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//  — EJS-шаблоны и статика
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//  — Парсеры
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  — Сессии
app.use(session({
    secret: process.env.SESSION_SECRET||'secret',
    resave: false,
    saveUninitialized: false
}));

//  — Доступ к user во всех шаблонах
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

//  — Подключаем роуты
app.use('/',      authRouter);    // /login, /register, /logout
app.use('/books', booksRouter);   // /books, /books/add, /books/search, /books/delete/:id
app.use('/cart',  cartRouter);    // /cart, /cart/add, /cart/checkout, /cart/remove
app.use('/orders',ordersRouter);
app.use('/users',  usersRouter);
app.use('/',      mainRouter);    // / (главная), /test-db
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//  — Запуск
const PORT = process.env.PORT || 3000;

// 1) создаём HTTP-сервер из Express-приложения
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// 2) экспортируем сам сервер, а не app
module.exports = server;

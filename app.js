require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, JS, картинки)
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session setup (сессии обязательны для авторизации, корзины и ролей)
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

// Middleware: делаем user доступным во всех views (res.locals.user)
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// ===== Подключение маршрутов =====
const booksRouter = require('./routes/books');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const mainRouter = require('./routes/index'); // Можно использовать для /, /test-db и т.д.

app.use('/', authRouter);      // /login, /register, /logout
app.use('/books', booksRouter); // /books, /books/add
app.use('/cart', cartRouter);   // /cart, /cart/add, /cart/checkout
app.use('/orders', ordersRouter); // /orders
app.use('/', mainRouter);      // / (главная), /test-db

// ===== Запуск сервера =====
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const User = require('../models/user');

exports.showRegister = (req, res) => {
    res.render('register', { error: null });
};

exports.register = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) {
        return res.render('register', { error: 'Все поля обязательны!' });
    }
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
        return res.render('register', { error: 'Пользователь уже существует!' });
    }
    await User.createUser(username, password, role || 'buyer');
    res.redirect('/login');
};

exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) {
        return res.render('login', { error: 'Неверное имя пользователя или пароль!' });
    }
    const isValid = await require('bcryptjs').compare(password, user.password);
    if (!isValid) {
        return res.render('login', { error: 'Неверное имя пользователя или пароль!' });
    }
    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect('/');
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

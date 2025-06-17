const express = require('express');
const router  = express.Router();
const { requireRole } = require('../middleware/auth');
const userModel       = require('../models/user');

// 1) Страница со всеми пользователями (только админ)
router.get('/all', requireRole('admin'), async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.render('usersAll', { users });
    } catch (err) {
        res.status(500).send('Ошибка при получении пользователей: ' + err.message);
    }
});

// 2) Удалить пользователя (только админ)
router.post('/delete/:id', requireRole('admin'), async (req, res) => {
    const id = parseInt(req.params.id, 10);

    // Защита: не позволяем админу удалить самого себя
    if (id === req.session.user.id) {
        return res.status(400).send('Нельзя удалить самого себя');
    }

    try {
        await userModel.deleteUser(id);
        res.redirect('/users/all');
    } catch (err) {
        res.status(500).send('Ошибка при удалении пользователя: ' + err.message);
    }
});

module.exports = router;
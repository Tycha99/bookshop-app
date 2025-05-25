const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.send('Успешно подключено к БД! Результат: ' + rows[0].result);
    } catch (err) {
        res.send('Ошибка подключения к БД: ' + err.message);
    }
});

module.exports = router;

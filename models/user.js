const pool = require('./db');
const bcrypt = require('bcryptjs');

async function findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
}

async function createUser(username, password, role = 'buyer') {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hash, role]
    );
    return result.insertId;
}

async function validatePassword(username, password) {
    const user = await findByUsername(username);
    if (!user) return false;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : false;
}

// Получить всех пользователей
async function getAllUsers() {
    const [rows] = await pool.query(
        'SELECT id, username, role FROM users ORDER BY id DESC'
    );
    return rows;
}

// Удалить пользователя по ID
async function deleteUser(id) {
    return pool.query('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = {
    findByUsername,
    createUser,
    validatePassword,
    getAllUsers,
    deleteUser
};
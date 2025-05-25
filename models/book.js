const pool = require('./db');

async function getAllBooks() {
    const [rows] = await pool.query('SELECT * FROM books');
    return rows;
}

module.exports = { getAllBooks };

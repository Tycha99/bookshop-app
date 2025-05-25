const pool = require('./db');

async function getAllBooks() {
    const [rows] = await pool.query('SELECT * FROM books');
    return rows;
}

async function addBook(title, author, price, description) {
    const [result] = await pool.query(
        'INSERT INTO books (title, author, price, description) VALUES (?, ?, ?, ?)',
        [title, author, price, description]
    );
    return result.insertId;
}


async function getBooksByIds(ids) {
    if (ids.length === 0) return [[], []];
    const placeholders = ids.map(() => '?').join(',');
    return pool.query(`SELECT * FROM books WHERE id IN (${placeholders})`, ids);
}
module.exports = { getAllBooks, addBook, getBooksByIds };

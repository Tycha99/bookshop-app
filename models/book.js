const pool = require('./db');

async function getAllBooks() {
    const [rows] = await pool.query('SELECT * FROM books');
    return rows;
}

async function addBook(title, author, price, description, image) {
    const [result] = await pool.query(
        `INSERT INTO books 
       (title, author, price, description, image) 
     VALUES (?, ?, ?, ?, ?)`,
        [title, author, price, description, image]
    );
    return result.insertId;
}

async function deleteBook(id) {
    await pool.query('DELETE FROM books WHERE id = ?', [id]);
}

async function getBooksByIds(ids) {
    if (ids.length === 0) return [[], []];
    const placeholders = ids.map(() => '?').join(',');
    return pool.query(
        `SELECT * FROM books WHERE id IN (${placeholders})`,
        ids
    );
}

async function searchBooksByTitle(query) {
    const like = `%${query}%`;
    const [rows] = await pool.query(
        'SELECT * FROM books WHERE title LIKE ?',
        [like]
    );
    return rows;
}

module.exports = {
    getAllBooks,
    addBook,
    deleteBook,
    getBooksByIds,
    searchBooksByTitle
};

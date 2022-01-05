const connection = require('./connection');

const getAll = async () => {
  const [rows] = await connection.execute('SELECT * FROM model_example.books')
  return rows;
};

const getBooksByAuthorId = async(id) => {
  const [rows] = await connection.execute('SELECT title FROM model_example.books WHERE author_id = ?', [id]);
  if (!rows) return null;
  return rows;
}

const addBook = async (title, id) => {
  await connection.execute('INSERT INTO model_example.books (title, author_id) VALUES (?, ?)', [title, id]);
}

module.exports = {
  getAll,
  getBooksByAuthorId,
  addBook
};

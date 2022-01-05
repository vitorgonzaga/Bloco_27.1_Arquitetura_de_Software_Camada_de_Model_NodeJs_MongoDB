const { ObjectId } = require('bson');
const connection = require('./connection');

const getAll = async () => {

  // Versão Mysql
  // const [rows] = await connection.execute('SELECT * FROM model_example.books')
  // return rows;

  const conn = await connection();
  const rows = await conn.collection('books').find().toArray();
  return rows;
};

const getBooksByAuthorId = async(id) => {

  // Versão Mysql
  // const [rows] = await connection.execute('SELECT title FROM model_example.books WHERE author_id = ?', [id]);
  // if (!rows) return null;
  // return rows;

  const conn = await connection();
  const oneAuthor = await conn.collection('books').findOne(ObjectId(id))

  if(!oneAuthor) return null;

  const { _id, title, author_id } = oneAuthor;

  return {
    id: _id,
    title,
    author_id
  };
};

const addBook = async (title, id) => {

  // Versão MySql
  // await connection.execute('INSERT INTO model_example.books (title, author_id) VALUES (?, ?)', [title, id]);
  // -----

  const conn = await connection();
  await conn.collection('books').insertOne({ title: title, author_id: id })

}

module.exports = {
  getAll,
  getBooksByAuthorId,
  addBook
};

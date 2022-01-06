// const { ObjectId } = require('mondodb');
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
console.log("id no getBooksById: ", id, typeof(id));
  // Versão Mysql
  // const [rows] = await connection.execute('SELECT title FROM model_example.books WHERE author_id = ?', [id]);
  // if (!rows) return null;
  // return rows;


  // const aggregation = [ { $match: { author_id: { $eq: id } } } ];
  const conn = await connection();
  // const idNumberFormat = parseInt(id);
  // return { id: _id, title, author_id } = await conn.collection('books').find( { author_id: id });
  const oneAuthor = await conn.collection('books').find({ author_id: id }).toArray();
  // const oneAuthor = await conn.collection('books').aggregate(aggregation);


  if(!oneAuthor) return null;
  console.log('oneAuthor: ', oneAuthor);
  return oneAuthor.map(({ _id, title, author_id }) => {
    return {
      id: _id,
      title,
      author_id
    }
  });
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

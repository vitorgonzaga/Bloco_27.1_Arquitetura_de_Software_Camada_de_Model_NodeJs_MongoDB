const connection = require('./connection');
const { ObjectId } = require('mongodb');

// ----------------------------------------
// mysql
// const getFullNameAuthor = (firstName, middleName, lastName) => {
//   // const fullName = [ firstName, middleName, lastName ].filter((string) => string).join(" "); // "(string) => string" faz com que o filtro desconsidere strings inexistentes (nulas)
//   const fullName = [ firstName, middleName, lastName ].filter(Boolean).join(" ");
//   return fullName
// }

// Optei por manter a função recebebdo objeto desestruturado nessa função para trabalhar com o mongodb
// nesse caso o retorno da função deve ser o objeto completo
const getFullNameAuthor = ({ id, firstName, middleName, lastName }) => {
  // const fullName = [ firstName, middleName, lastName ].filter((string) => string).join(" "); // "(string) => string" faz com que o filtro desconsidere strings inexistentes (nulas)
  const fullName = [ firstName, middleName, lastName ].filter(Boolean).join(" ");
  return {
    id,
    firstName,
    middleName,
    lastName,
    fullName
  }
};

// ----------------------------------------
// mysql
const serialize = (authorData) => {
  return {
    id: authorData.id,
    firstName: authorData.first_name,
    middleName: authorData.middle_name,
    lastName: authorData.last_name,
    fullName: getFullNameAuthor(authorData.first_name, authorData.middle_name, authorData.last_name)
  }
}

// Operações com banco de dados geralmente são assincronas
// O parâmetro da função execute da instancia "connection" é a querie SQL em formato de string (exatamente como seria escrita no workbench, por exemplo)
const getAll = async () => {
  // ----------------------------------------
  // mysql
  // const [authors] = await connection.execute('SELECT id, first_name, middle_name, last_name from authors');
  // return authors.map(serialize);
  // ----------------------------------------

  return connection()
  .then((db) => db.collection('authors').find().toArray())
  .then((authors) => {
    return authors.map(({ _id, firstName, middleName, lastName }) => {
      return getFullNameAuthor({
        id: _id,
        firstName,
        middleName,
        lastName
        // fullName // Não precisa informar o fullName aqui pois o retorno da função já contempla ele
      })
    })
  });

};

const getAuthorById = async (id) => {
  // versão mysql
  // const [author] = await connection.execute('select id, first_name, middle_name, last_name from authors where id = ?', [id])
  // if(!author) return null
  // // console.log('author from getAuthorById: ', author);
  // return author.map(serialize)[0];

  if (ObjectId.isValidId(id)) return null;

  const conn = await connection();
  const authorData = await conn.collection('authors').findOne(ObjectId(id)); // Sempre usar a função ObjectId nativa do mongodb para validar ids nas queries

  if(!authorData) return null;

  const { firstName, middleName, lastName } = authorData;

  return getFullNameAuthor({
    id, // Não precisa informar "_id", pois ele chega como parâmetro na função
    firstName,
    middleName,
    lastName
  });
};

const isValid = (first_name, middle_name, last_name) => {
  if(!first_name || typeof(first_name) !== 'string') return false;
  if(!last_name || typeof(last_name) !== 'string') return false;
  if(middle_name && typeof(middle_name) !== 'string') return false; // Tabela verdade conjução só é verdadeira quanto as 2 proposições forem verdadeiras, ou seja, só será impeditivo quando houver middle_name diferente de string

  return true;
};

const addAuthor = async (firstName, middleName, lastName) => {
  // Versão mysql
  // await connection.execute(
  // 'INSERT INTO model_example.authors (first_name, middle_name, last_name) VALUES (?, ?, ?)',
  // [firstName, middleName, lastName])

  const conn = await connection();
  await conn.collection('authors').insertOne({ first_name: firstName, middle_name: middleName, last_name: lastName })
};

const isValidId = (id) => {
  if(!id) return false;
  return true;
};


// const deleteAuthorById = async (id) => await connection.execute(
//   'DELETE FROM model_example.authors WHERE id = ?', [id]
// );

module.exports = {
  getAll,
  serialize,
  getAuthorById,
  addAuthor,
  isValid,
  // deleteAuthorById,
  isValidId
};

// echo '{ "first_name": "Vitor", "middle_name": "Gonzaga", "last_name": "Ferreira" }' | http POST :3000/authors
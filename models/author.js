const connection = require('./connection');

const getFullNameAuthor = (firstName, middleName, lastName) => {
  // const fullName = [ firstName, middleName, lastName ].filter((string) => string).join(" "); // "(string) => string" faz com que o filtro desconsidere strings inexistentes (nulas)
  const fullName = [ firstName, middleName, lastName ].filter(Boolean).join(" ");
  return fullName
}

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
  const [authors] = await connection.execute('SELECT id, first_name, middle_name, last_name from authors');

  return authors.map(serialize);
};

const getAuthorById = async (id) => {
  const [author] = await connection.execute('select id, first_name, middle_name, last_name from authors where id = ?', [id])
  if(!author) return null
  // console.log('author from getAuthorById: ', author);
  return author.map(serialize)[0];
}

const isValid = (first_name, middle_name, last_name) => {
  if(!first_name || typeof(first_name) !== 'string') return false;
  if(!last_name || typeof(last_name) !== 'string') return false;
  if(middle_name && typeof(middle_name) !== 'string') return false; // Tabela verdade conjução só é verdadeira quanto as 2 proposições forem verdadeiras, ou seja, só será impeditivo quando houver middle_name diferente de string

  return true;
}

const addAuthor = async (firstName, middleName, lastName) => await connection.execute(
  'INSERT INTO model_example.authors (first_name, middle_name, last_name) VALUES (?, ?, ?)',
  [firstName, middleName, lastName]
);

const isValidId = (id) => {
  if(!id) return false;
  return true;
}


const deleteAuthorById = async (id) => await connection.execute(
  'DELETE FROM model_example.authors WHERE id = ?', [id]
);

module.exports = {
  getAll,
  serialize,
  getAuthorById,
  addAuthor,
  isValid,
  deleteAuthorById,
  isValidId
}

// echo '{ "first_name": "Vitor", "middle_name": "Gonzaga", "last_name": "Ferreira" }' | http POST :3000/authors
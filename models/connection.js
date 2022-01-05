// *****************************************
// Versão MySQL
// *****************************************

// const mysql = require('mysql2/promise');

// const connection = mysql.createPool({
//   user: 'vitor',
//   password:'2311mari',
//   host: 'localhost',
//   database: 'model_example'
// });

// *****************************************
// Versão MongoDB
// *****************************************

const e = require('express');
const { MongoClient } = require('mongodb');

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const MONGOBD_URL = 'mongodb://127.0.0.1:27017'

const connection = async () => {
  return MongoClient.connect(MONGOBD_URL, OPTIONS)
  .then((conn) => conn.db('model_example'))
  .catch((err) => {
    console.error(err);
    process.exit();
  })
}

module.exports = connection;
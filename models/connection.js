const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  user: 'vitor',
  password:'2311mari',
  host: 'localhost',
  database: 'model_example'
});

module.exports = connection;


const mysql = require("mysql2");

var DB = mysql.createConnection({
  host: 'mysql_db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});


module.exports = DB;
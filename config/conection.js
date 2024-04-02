
const mysql = require("mysql2");

var DB = mysql.createConnection({
    host: "172.18.0.2",
    user: "backend",
    password: "67dayy$51%",
    database: "meurotulo",
    port: "3306",
  });
  
module.exports  = DB;
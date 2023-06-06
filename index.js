const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
app.use(express.json());
app.use(cors());

var DB = mysql.createConnection({
  host: "aws.connect.psdb.cloud",
  user: "guq4gm37b3opbtzwb5no",
  password: "pscale_pw_R42hmuPPoVupa9ZNuaD56k3CxmcrvktHcIWk3mraem0",
  database: "meurotulo",
  ssl: {
    rejectUnauthorized: true,
  },
});

app.get("/", (req, res) => {
  let sql = `select * from AlimentosRotulos`;
  DB.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.get("/seach", (req, res) => {
  const { values } = req.query;
  let sql = `SELECT NomeDoAlimento FROM AlimentosRotulos  WHERE NomeDoAlimento LIKE ?`;
  console.log(values);
  DB.query(sql, [values + "%"], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.get("/seachalimentos", (req, res) => {
  const { values } = req.query;
  let sql = `SELECT * FROM AlimentosRotulos  WHERE NomeDoAlimento LIKE ?`;
  console.log(values);
  DB.query(sql, [values + "%"], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.put("/add", (req, res) => {
  const { NomeDoAlimento, Rotulo, DataDeAdicao } = req.body;
  console.log(NomeDoAlimento + Rotulo + DataDeAdicao);

  let sql =
    "INSERT INTO AlimentosRotulos (NomeDoAlimento, Rotulo , DataDeAdicao) VALUES(?,?,?)";
  DB.query(sql, [NomeDoAlimento, Rotulo, DataDeAdicao], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});
app.put("/delete", (req, res) => {
  let sql = "truncate table AlimentosRotulos";
  DB.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Tabela AlimentosRotulos deletada...");
  });
});
app.post("/login", (req, res) => {
  const { cpf, senha } = req.body;
  let sql =
    `SELECT * FROM adm where cpf = ?`;
  DB.query(sql,[cpf], (err, result) => {
    if (err) throw err;
  
    if(result[0]?.senha===senha){
      console.log("Senha Correta");
      res.send({status:200, erro:"", result});
      return;
    }
    else{
      res.send({status:401, erro:"Erro senha  credenciais incorretas"});
    }
  });
});

app.listen(3001, () => {
  console.log("Servidor iniciado port 3001");
  let data = new Date();
  let hora = data.getHours() + ":" + data.getMinutes() + ":00";
  console.log(typeof hora);
});

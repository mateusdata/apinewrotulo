const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
app.use(express.json());
app.use(cors());

var DB = mysql.createConnection({
  host: "aws.connect.psdb.cloud",
  user: "ck0jz1c9g3sprh0o1oos",
  password: "pscale_pw_j6zp42hxMqislkfJybLddgxhysQhqiBkYQnf2rjQCu",
  database: "meurotulo",
  ssl: {
    rejectUnauthorized: true,
  },
});

/*

database: meurotulo
username: ck0jz1c9g3sprh0o1oos
host: aws.connect.psdb.cloud
password: pscale_pw_j6zp42hxMqislkfJybLddgxhysQhqiBkYQnf2rjQCu


*/

app.get("/", (req, res) => {
  let sql = `select * from ingredientes`;
  DB.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.get("/seach", (req, res) => {
  const { values } = req.query;
  let sql = `SELECT nome_pt FROM ingredientes  WHERE nome_pt LIKE ?`;
  console.log(values);
  DB.query(sql, [values + "%"], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.get("/seachalimentos", (req, res) => {
  const { values } = req.query;
  let sql = `SELECT * FROM ingredientes  WHERE nome_pt = ?`;
  console.log(values);
  DB.query(sql, [values ], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});
app.get("/seachUser", (req, res) => {
  const { cpf } = req.query;
  console.log(cpf);
  let sql = `SELECT nome FROM adm  WHERE cpf = ?`;
  console.log(cpf);
  DB.query(sql, [cpf], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});
app.put("/add", (req, res) => {
  let { 
    namePt,
    nameUs,
    nameLatin,
    mainFunction,
    origin,
    selectedValue,
    DataDeAdicao,
    nomeUser } = req.body;
    console.log( namePt  +" " +
    nameUs  +" " +
    nameLatin  +" " +
    mainFunction  +" " +
    origin  +" " +
    selectedValue  +" " +
    DataDeAdicao+
    nomeUser);
    if(selectedValue==="Alimentícios"){
      selectedValue=1
    }
    else if(selectedValue==="Corporais"){
      selectedValue=2
    }
    else{
      selectedValue=3
    }
    const numberId = parseInt(selectedValue)
  let sql =
    "INSERT INTO ingredientes (nome_pt, nome_us, nome_latim, funcao_principal, origin, adm_criador, data_criacao, categoria_id) VALUES(?,?,?,?,?,?,?,?)";
  DB.query(sql, [
    namePt,
    nameUs,
    nameLatin,
    mainFunction,
    origin,
    nomeUser,
    DataDeAdicao,
    numberId,
     ], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Item cadastrado");
  });
});
app.put("/delete", (req, res) => {
  let sql = "truncate table ingredientes";
  DB.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Tabela ingredientes deletada...");
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

app.listen(3000, () => {
  console.log("Servidor iniciado port 3001");
  let data = new Date();
  let hora = data.getHours() + ":" + data.getMinutes() + ":00";
  console.log(typeof hora);
});

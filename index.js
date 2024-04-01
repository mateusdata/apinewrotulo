const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
app.use(express.json());
app.use(cors());

var DB = mysql.createConnection({
  host: "172.18.0.2",
  user: "backend",
  password: "67dayy$51%",
  database: "meurotulo",
  port: "3306",
});

function testarConexao() {
  DB.connect(function(err) {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    DB.end();
  });
}


app.get("/create", (req, res) => {
  const cpf = "11111111111";
  const nome = "Mateus";
  const senha = "123456";

  let sql = `
    INSERT INTO adm (cpf, nome, senha)
    VALUES (?, ?, ?)
  `;

  const values = [cpf, nome, senha];

  DB.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao criar usuário");
    }

    res.send("Usuário criado com sucesso!");
  });
});


app.get("/", (req, res) => {
  
  let sql = `show tables`;

  DB.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });

});

app.get("/show", (req, res) => {
  let sql = `
    SELECT
      i.*,
      CASE i.categoria_id
        WHEN 1 THEN 'Alimentícios'
        WHEN 2 THEN 'Corporais'
        WHEN 3 THEN 'Saneantes'
        ELSE 'Outro'
      END AS categoria_nome
    FROM ingredientes i;
  `;
  
  DB.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete("/delete/item/:id", (req, res) => {
  const id = req.params.id;
  let sql = `DELETE FROM ingredientes WHERE id = ?`;

  DB.query(sql, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/seach", (req, res) => {
  const { values } = req.query;
  let sql = `SELECT nome_pt FROM ingredientes  WHERE nome_pt LIKE ?`;

  DB.query(sql, [values + "%"], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/seachalimentos", (req, res) => {
  const { values } = req.query;
  let sql = `SELECT * FROM ingredientes  WHERE nome_pt = ?`;

  DB.query(sql, [values ], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/seachUser", (req, res) => {
  const { cpf } = req.query;
  let sql = `SELECT nome FROM adm  WHERE cpf = ?`;
  DB.query(sql, [cpf], (err, result) => {
    if (err) throw err;
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
    category,
    DataDeAdicao,
    nomeUser } = req.body;

  let sqlSelect = "SELECT * FROM ingredientes WHERE nome_pt = ?";
  DB.query(sqlSelect, [namePt], (err, result) => {
    if (err) throw err;

    const existingItem = result.find(item => item.categoria_id === category);
    if (existingItem) {
      // Se já existe um registro com o mesmo nomePt e categoria igual, retorne um erro
      res.status(400).send({ error: "Item já cadastrado com este nome e categoria." });
    } else {
      // Caso contrário, insira o novo item no banco de dados
      let sqlInsert =
        "INSERT INTO ingredientes (nome_pt, nome_us, nome_latim, funcao_principal, origin, adm_criador, data_criacao, categoria_id) VALUES(?,?,?,?,?,?,?,?)";
      DB.query(sqlInsert, [
        namePt,
        nameUs,
        nameLatin,
        mainFunction,
        origin,
        nomeUser,
        DataDeAdicao,
        category,
      ], (err, result) => {
        if (err) throw err;
        res.send("Item cadastrado");
      });
    }
  });
});




app.put("/delete", (req, res) => {
  let sql = "truncate table ingredientes";
  DB.query(sql, (err, result) => {
    if (err) throw err;
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
      res.send({status:200, erro:"", result});
      return;
    }
    else{
      res.send({status:401, erro:"Erro senha  credenciais incorretas"});
    }
  });
});


app.listen(3002, () => {
  console.log(`Server listening on port: ${3002}`);
  
});

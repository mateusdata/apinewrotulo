const DB = require("../../config/conection");

class SubstancesController {

    getAlimentos(req, res) {
        const { values, categoria } = req.query;
        let sql = `SELECT * FROM ingredientes WHERE nome_pt = ?`;
      
        if (categoria) {
          sql += ` AND categoria_id = ?`;
        }
      
        DB.query(sql, categoria ? [values, categoria] : [values], (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      }


      
      getAlimentosLike(req, res) {
        const { values, categoria } = req.query;
        let sql = `SELECT nome_pt FROM ingredientes WHERE nome_pt LIKE ?`;
      
        if (categoria) {
          sql += ` AND categoria_id = ?`;
        }
      
        DB.query(sql, categoria ? [values + "%", categoria] : [values + "%"], (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      }
      


    delete(req, res) {
        const id = req.params.id;
        console.log(id)
        let sql = `DELETE FROM ingredientes WHERE id = ?`;

        DB.query(sql, id, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    }


    show(req, res) {
        let sql = `
            SELECT 
                i.*, 
                CASE i.categoria_id 
                    WHEN 1 THEN 'Alimentícios' 
                    WHEN 2 THEN 'Corporais' 
                    WHEN 3 THEN 'Saneantes' 
                    ELSE 'Outro' 
                END AS categoria_nome 
            FROM 
                ingredientes i 
            ORDER BY 
                i.data_criacao DESC;`;
    
        DB.query(sql, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    }
    

    create(req, res) {
        let { namePt, nameUs, nameLatin, mainFunction, origin, category, DataDeAdicao, nomeUser } = req.body;

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
    }


    update(req, res){
        console.log(req.body )
    }

    truncate(req, res) {
        let sql = "truncate table ingredientes";
        DB.query(sql, (err, result) => {
            if (err) throw err;
            res.send("Tabela ingredientes deletada...");
        });
    }

}
module.exports = new SubstancesController();
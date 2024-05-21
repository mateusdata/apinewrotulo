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
      
        // Verificar se a string de pesquisa tem pelo menos 3 caracteres
        if (values.trim().length < 3) {
            return res.send([]); // Retorna um array vazio se a string de pesquisa não tiver pelo menos 3 caracteres
        }
    
        // Convertendo a string de pesquisa para minúsculas
        const searchValue = values.trim().toLowerCase();
    
        // Usando utf8mb4 e utf8mb4_general_ci para garantir que a comparação seja insensível a acentos e maiúsculas
        let sql = `
            SELECT nome_pt 
            FROM ingredientes 
            WHERE LOWER(nome_pt) LIKE ? COLLATE utf8mb4_general_ci
        `;
      
        if (categoria) {
            sql += ` AND categoria_id = ?`;
        }
    
        // Usando a string de pesquisa convertida para minúsculas
        DB.query(sql, categoria ? [searchValue + "%", categoria] : [searchValue + "%"], (err, result) => {
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
        const {nome_pt} = req.params
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
    

    showSeach(req, res) {
        const { nome_pt } = req.params;
        console.log(nome_pt);
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
            WHERE 
                LOWER(i.nome_pt) LIKE LOWER(?) COLLATE utf8mb4_general_ci 
            ORDER BY 
                i.data_criacao DESC;`;
    
        DB.query(sql, [`%${nome_pt.toLowerCase()}%`], (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    }
    
    

    create(req, res) {
        let { namePt, nameUs, nameLatin, mainFunction, origin, category, DataDeAdicao, nomeUser, ref } = req.body;
        console.log(ref);

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
                    "INSERT INTO ingredientes (nome_pt, nome_us, nome_latim, funcao_principal, origin, adm_criador, ref, data_criacao, categoria_id) VALUES(?,?,?,?,?,?,?,?,?)";
                DB.query(sqlInsert, [
                    namePt,
                    nameUs,
                    nameLatin,
                    mainFunction,
                    origin,
                    nomeUser,
                    ref,
                    DataDeAdicao,
                    category,
                ], (err, result) => {
                    if (err) throw err;
                    res.send("Item cadastrado");
                });
            }
        });
    }


    createAll(req, res) {
        let substances = req.body;
    
        let values = substances.map(substance => [
            substance.namePt,
            substance.nameUs,
            substance.nameLatin,
            substance.mainFunction,
            substance.origin,
            substance.category,
            substance.ref,
            new Date().toISOString().slice(0, 19).replace('T', ' '), // Data de criação
            substance.nomeUser // Adm criador
        ]);
    
        // Verifica a existência de cada substância no banco de dados
        let sqlSelect = "SELECT nome_pt, categoria_id FROM ingredientes WHERE (nome_pt, categoria_id) IN (?)";
        let selectValues = substances.map(substance => [substance.namePt, substance.category]);
    
        DB.query(sqlSelect, [selectValues], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: "Ocorreu um erro ao verificar as substâncias." });
                return;
            }
    
            let existingSubstances = result.map(row => ({ namePt: row.nome_pt, category: row.categoria_id }));
            let duplicateItems = substances.filter(substance =>
                existingSubstances.some(existing =>
                    existing.namePt === substance.namePt && existing.category === substance.category
                )
            );
    
            // Filtra apenas as substâncias únicas
            let uniqueSubstances = substances.filter(substance =>
                !duplicateItems.some(duplicate =>
                    duplicate.namePt === substance.namePt && duplicate.category === substance.category
                )
            );
    
            // Se não houver substâncias únicas para inserir, retorna mensagem informando
            if (uniqueSubstances.length === 0) {
                res.status(400).send({ error: "Todas as substâncias já estão cadastradas na mesma categoria." });
                return;
            }
    
            // Monta os valores para inserção das substâncias únicas
            let uniqueValues = uniqueSubstances.map(substance => [
                substance.namePt,
                substance.nameUs,
                substance.nameLatin,
                substance.mainFunction,
                substance.origin,
                substance.ref,
                substance.category,
                new Date().toISOString().slice(0, 19).replace('T', ' '), // Data de criação
                substance.nomeUser // Adm criador
            ]);
    
            // Monta a query de inserção múltipla apenas para as substâncias únicas
            let sqlInsert =
                "INSERT INTO ingredientes (nome_pt, nome_us, nome_latim, funcao_principal, origin, ref, categoria_id, data_criacao, adm_criador) VALUES ?";
    
            DB.query(sqlInsert, [uniqueValues], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ error: "Ocorreu um erro ao criar as substâncias." });
                    return;
                }
    
                res.send("Substâncias criadas com sucesso");
            });
        });
    }
    
    

    
    update(req, res) {
        let { namePt, nameUs, nameLatin, mainFunction, origin, category, DataDeAdicao, ref} = req.body;
        let id = req.params.id;
    
        let sqlUpdate = "UPDATE ingredientes SET nome_pt = ?, nome_us = ?, nome_latim = ?, funcao_principal = ?, origin = ?, data_criacao = ?, ref = ?, categoria_id = ? WHERE id = ?";
        DB.query(sqlUpdate, [namePt, nameUs, nameLatin, mainFunction, origin, DataDeAdicao, ref, category, id], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: "Ocorreu um erro ao atualizar o item." });
                return;
            }
    
            if (result.affectedRows === 0) {
                res.status(404).send({ error: "Item não encontrado." });
                return;
            }
    
            res.send("Item atualizado");
        });
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
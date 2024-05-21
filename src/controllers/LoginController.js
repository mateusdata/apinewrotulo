const DB = require("../../config/conection");
const bcrypt = require('bcrypt');


class LoginController {

    login(req, res) {
        const { cpf, senha } = req.body;
        let sql = `SELECT * FROM adm WHERE cpf = ?`;

        DB.query(sql, [cpf], async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao realizar login");
            }

            if (result.length === 0) {
                return res.status(401).send({ status: 401, erro: "Credenciais incorretas" });
            }

            const user = result[0];
            try {
                // Comparar a senha fornecida com o hash armazenado no banco de dados
                const match = await bcrypt.compare(senha, user.senha);
                if (match) {
                    res.status(200).send({ status: 200, mensagem: "Login bem sucedido", user });
                } else {
                    res.status(401).send({ status: 401, erro: "Credenciais incorretas" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send("Erro ao realizar login");
            }
        });
    }


    getNameAdm(req, res) {
        const { cpf } = req.query;
        let sql = `SELECT nome FROM adm  WHERE cpf = ?`;
        DB.query(sql, [cpf], (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    }

    showTables(req, res) {

        let sql = `show tables`;

        DB.query(sql, (err, result) => {
            if (err) throw err;
            res.send(result);
        });

    }

    reset(req, res) {
        const { cpf } = req.query;

        // Drop tabela 'adm' se existir
        let sqlDropAdm = `DROP TABLE IF EXISTS adm`;
        DB.query(sqlDropAdm, (err, dropResultAdm) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao excluir tabela 'adm'");
            }

            // Criação da tabela 'adm'
            let sqlCreateAdm = `CREATE TABLE adm (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100),
                cpf VARCHAR(11) UNIQUE,
                senha VARCHAR(255)
            )`;
            DB.query(sqlCreateAdm, (err, createResultAdm) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Erro ao criar tabela 'adm'");
                }

                // Drop tabela 'ingredientes' se existir
                let sqlDropIngredientes = `DROP TABLE IF EXISTS ingredientes`;
                DB.query(sqlDropIngredientes, (err, dropResultIngredientes) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Erro ao excluir tabela 'ingredientes'");
                    }

                    // Criação da tabela 'ingredientes'
                    let sqlCreateIngredientes = `CREATE TABLE ingredientes (
                        id INT NOT NULL AUTO_INCREMENT,
                        nome_pt VARCHAR(255),
                        nome_us VARCHAR(255),
                        nome_latim VARCHAR(255),
                        funcao_principal TEXT,
                        ref TEXT,
                        origin TEXT,
                        adm_criador VARCHAR(255),
                        data_criacao VARCHAR(255),
                        categoria_id INT,
                        PRIMARY KEY (id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`;
                    DB.query(sqlCreateIngredientes, (err, createResultIngredientes) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send("Erro ao criar tabela 'ingredientes'");
                        }

                        res.send("Tabelas 'adm' e 'ingredientes' recriadas com sucesso!");
                    });
                });
            });
        });
    }
}

module.exports = new LoginController();
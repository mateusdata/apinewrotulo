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
        let sqlDrop = `DROP TABLE IF EXISTS adm`;
        
        DB.query(sqlDrop, (err, dropResult) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao excluir tabela");
            }
            
            let sqlCreate = `CREATE TABLE adm (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100),
                cpf VARCHAR(11) UNIQUE,
                senha VARCHAR(255)
            )`;

            DB.query(sqlCreate, (err, createResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Erro ao criar tabela");
                }

                res.send("Tabela 'adm' recriada com sucesso!");
            });
        });
    }

    

}

module.exports = new LoginController();
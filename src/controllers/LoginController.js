const DB = require("../../config/conection");


class LoginController {

    login(req, res) {
        const { cpf, senha } = req.body;
        let sql =
            `SELECT * FROM adm where cpf = ?`;
        DB.query(sql, [cpf], (err, result) => {
            if (err) throw err;

            if (result[0]?.senha === senha) {
                res.send({ status: 200, erro: "", result });
                return;
            }
            else {
                res.send({ status: 401, erro: "Erro senha  credenciais incorretas" });
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
}

module.exports = new LoginController();
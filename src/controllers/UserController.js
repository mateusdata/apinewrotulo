
const DB = require("../../config/conection");


class UserController {

    create(req, res) {
        const cpf = "11111111111";
        const nome = "Mateus";
        const senha = "123456";
        let sql = `INSERT INTO adm (cpf, nome, senha) VALUES (?, ?, ?)`;

        const values = [cpf, nome, senha];

        DB.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao criar usuário");
            }

            res.send("Usuário criado com sucesso!");
        });
    }

}

module.exports = new UserController();


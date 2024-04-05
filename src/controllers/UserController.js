
const DB = require("../../config/conection");


class UserController {

    create(req, res) {
        const users = [
            { nome: "Mateus", cpf: "11111111111", senha: "123456" },
            { nome: "Rabelo", cpf: "33333333333", senha: "102030" },
            { nome: "Emanuel", cpf: "44444444444", senha: "102030" }
        ];

        let sql = `INSERT INTO adm (nome, cpf, senha) VALUES ?`;

        const values = users.map(user => [user.nome, user.cpf, user.senha]);

        DB.query(sql, [values], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao criar usuários");
            }

            res.send("Usuários criados com sucesso!");
        });
    }

}

module.exports = new UserController();


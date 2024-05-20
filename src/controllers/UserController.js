
const DB = require("../../config/conection");
const bcrypt = require('bcrypt');

class UserController {

    async create(req, res) {
        const users = [
            { nome: "Mateus", cpf: "11111111111", senha: "123456" },
            { nome: "Rabelo", cpf: "33333333333", senha: "102030" },
            { nome: "Emanuel", cpf: "44444444444", senha: "102030" }
        ];

        try {
            // Iterar sobre os usuários e criptografar as senhas
            for (let user of users) {
                const hashedPassword = await bcrypt.hash(user.senha, 10);
                user.senha = hashedPassword;
            }

            let sql = `INSERT INTO adm (nome, cpf, senha) VALUES ?`;

            const values = users.map(user => [user.nome, user.cpf, user.senha]);

            DB.query(sql, [values], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Erro ao criar usuários");
                }

                res.send("Usuários criados com sucesso!");
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao criar usuários");
        }
    }

    async createDependent(req, res) {
        const { nome, cpf, senha } = req.body; // Assume que o corpo da solicitação contém os campos nome, cpf e senha

        try {
            // Criptografar a senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Inserir o novo usuário no banco de dados
            const sql = `INSERT INTO adm (nome, cpf, senha) VALUES (?, ?, ?)`;
            DB.query(sql, [nome, cpf, hashedPassword], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Erro ao criar usuário");
                }

                res.send("Usuário criado com sucesso!");
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao criar usuário");
        }
    }
}

module.exports = new UserController();



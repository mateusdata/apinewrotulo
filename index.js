const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const LoginController = require("./src/controllers/LoginController");
const SubstancesController = require("./src/controllers/SubstancesController");
const UserController = require("./src/controllers/UserController");
const DB = require("./config/conection");
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.get("/create", UserController.create );
app.post("/create-account", UserController.createDependent);


app.get("/", LoginController.showTables);
app.get("/seachUser", LoginController.getNameAdm);
app.post("/login", LoginController.login);
app.get("/reset-adm/meurotulo", LoginController.reset)

app.get("/show", SubstancesController.show);
app.delete("/delete/item/:id", SubstancesController.delete);
app.get("/seach", SubstancesController.getAlimentosLike);
app.get("/seachalimentos", SubstancesController.getAlimentos);
app.put("/add", SubstancesController.create);
app.post("/create-all-substances", SubstancesController.createAll);

app.put("/update-substance/:id", SubstancesController.update);
app.get("/seach-substance/:nome_pt", SubstancesController.showSeach);


app.put("/delete", SubstancesController.truncate);


app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server listening on port: http://localhost:${process.env.BACKEND_PORT}`);
});


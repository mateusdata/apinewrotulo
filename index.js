const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const LoginController = require("./src/controllers/LoginController");
const SubstancesController = require("./src/controllers/SubstancesController");
const UserController = require("./src/controllers/UserController");
const DB = require("./config/conection");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/create", UserController.create );

app.get("/", LoginController.showTables);
app.get("/seachUser", LoginController.getNameAdm);
app.post("/login", LoginController.login);


app.get("/show", SubstancesController.show);
app.delete("/delete/item/:id", SubstancesController.delete);
app.get("/seach", SubstancesController.getAlimentosLike);
app.get("/seachalimentos", SubstancesController.getAlimentos);
app.put("/add", SubstancesController.create);
app.put("/update/:id", SubstancesController.update);

app.put("/delete", SubstancesController.truncate);


app.listen(3002, () => {
  console.log(`Server listening on port: ${3002}`);
  
});

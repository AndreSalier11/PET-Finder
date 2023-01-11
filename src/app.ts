import express, {Application} from "express";
require('dotenv').config();

const db_routes = require("./database/routes/routes");
const PORT = process.env.PORT;
const HOST = process.env.HOST;

let db_app: Application = express();
db_app.use("", db_routes);


db_app.listen(PORT, function () {
  console.log("🐶 Base de Dados online! - A ouvir http://" + HOST + ":" + PORT);
});
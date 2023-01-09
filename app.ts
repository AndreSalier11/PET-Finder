import express from "express";
const db_routes = require("./services/database/routes/routes");

let db_app = express();
db_app.use("/", db_routes);
const db_conn = require("./services/database/connection.json");

db_app.listen(db_conn.port, function () {
  console.log("Serviço - Base de Dados ligada - porta " + db_conn.port);
});

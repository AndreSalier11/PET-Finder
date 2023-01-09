"use strict";
exports.__esModule = true;
var express_1 = require("express");
var db_routes = require("./services/database/routes/routes");
var db_app = (0, express_1["default"])();
db_app.use("/", db_routes);
var db_conn = require("./services/database/connection.json");
db_app.listen(db_conn.port, function () {
    console.log("Serviço - Base de Dados ligada - porta " + db_conn.port);
});

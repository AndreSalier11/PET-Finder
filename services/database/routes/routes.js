"use strict";
exports.__esModule = true;
var mysql_1 = require("mysql");
var express_1 = require("express");
var db_conn = require("./services/database/connection.json");
var router = express_1["default"].Router();
var conn = mysql_1["default"].createConnection(db_conn);
conn.connect(function (err) {
    if (err)
        return console.log("\nerror: " + err.message);
    conn.end;
});
module.exports = router;

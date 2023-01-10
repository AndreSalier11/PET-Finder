"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../../typings/config"));
const db_conn = {
    host: config_1.default.HOST,
    port: config_1.default.PORT,
    database: config_1.default.DATABASE,
    user: config_1.default.USER,
    password: config_1.default.PASSWORD
};
const router = express_1.default.Router();
router.get("/", function (req, res) {
    res.status(200).send("Olá");
});
let conn = mysql_1.default.createConnection(db_conn);
conn.connect(function (err) {
    if (err)
        return console.log("\nerror: " + err.message);
    conn.end;
});
module.exports = router;

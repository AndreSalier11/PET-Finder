"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../../typings/config"));
const router = express_1.default.Router();
const db_conn = {
    host: config_1.default.HOST,
    port: config_1.default.PORT,
    database: config_1.default.DATABASE,
    user: config_1.default.USER,
    password: config_1.default.PASSWORD
};
const conn = mysql_1.default.createConnection(db_conn);
router.get("/", function (req, res) {
    conn.connect(function (err) {
        if (err)
            return console.log("\nerror: " + err.message);
        conn.end;
    });
    res.status(200).send("Olá");
});
module.exports = router;

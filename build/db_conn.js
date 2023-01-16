"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const config_1 = __importDefault(require("./config"));
const db_conn = {
    host: config_1.default.DB_HOST,
    port: config_1.default.DB_PORT,
    database: config_1.default.DATABASE,
    user: config_1.default.DB_USER,
    password: config_1.default.DB_PASSWORD,
};
const conn = mysql_1.default.createConnection(db_conn);
conn.connect(function (err) {
    if (err)
        return console.log("🚩 Erro de ligação na DB: " + err.message);
    console.log("🐱 Ligado à DB");
});
module.exports = conn;

import mysql, { ConnectionConfig } from "mysql";
import config from "./config";

const db_conn: ConnectionConfig = {
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DATABASE,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
};

const conn = mysql.createConnection(db_conn);

conn.connect(function (err: any) {
  if (err) return console.log("🚩 Erro de ligação na DB: " + err.message);
  console.log("🐱 Ligado à DB");
});

module.exports = conn;

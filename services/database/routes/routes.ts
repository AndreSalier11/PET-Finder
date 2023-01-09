import mysql from "mysql";
import express from "express";

const db_conn = require("./services/database/connection.json");
const router = express.Router();

let conn = mysql.createConnection(db_conn);
conn.connect(function (err) {
  if (err) return console.log("\nerror: " + err.message);

  

  conn.end;
});

module.exports = router;
import mysql from "mysql";
import express from "express";

const db_conn: any = {
  "host": process.env.host,
  "port": process.env.port,
  "user": process.env.root,
  "password": process.env.password,
  "database": process.env.database
};
const router = express.Router();

let conn = mysql.createConnection(db_conn);
conn.connect(function (err: any) {
  if (err) return console.log("\nerror: " + err.message);

  

  conn.end;
});

module.exports = router;
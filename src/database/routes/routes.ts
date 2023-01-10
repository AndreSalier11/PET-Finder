import mysql from "mysql";
import express, { Router } from "express";
import config from "../../typings/config";

const db_conn = {
  host: config.HOST,
  port: config.PORT,
  database: config.DATABASE,
  user: config.USER,
  password: config.PASSWORD
};

const router: Router = express.Router();

router.get("/", function(req, res) {
  res.status(200).send("Olá");
});

let conn = mysql.createConnection(db_conn);
conn.connect(function (err: any) {
  if (err) return console.log("\nerror: " + err.message);


  conn.end;
});

module.exports = router;
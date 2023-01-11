import mysql from "mysql";
import express, { Router } from "express";
import config from "../typings/config";
const router: Router = express.Router();


const db_conn = {
  host: config.HOST,
  port: config.PORT,
  database: config.DATABASE,
  user: config.USER,
  password: config.PASSWORD
};

const conn = mysql.createConnection(db_conn);

conn.connect(function (err: any) {
  if (err) return console.log("\n🚩 error: " + err.message);
  console.log("🐶 Ligado à DB");
});


router.get("/", function(req, res) {

})

module.exports = router;

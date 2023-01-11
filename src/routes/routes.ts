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


router.get("/getuser/:id", function(req, res) {

  conn.connect(function (err: any) {
    if (err) return console.log("\nerror: " + err.message);
    
  
    conn.end;
  });

  res.status(200).send("Olá");
});



module.exports = router;
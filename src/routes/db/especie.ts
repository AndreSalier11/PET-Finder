import express, { Request, Response, Router } from "express";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
import { Connection } from "mysql";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");


router.get("/:id", authenticateToken, checkRole.checkId, function(req:any, res) {
  conn.query("SELECT nome_especie FROM tbl_especie WHERE id_especie = ? LIMIT 1", [req.params.id], function(err, result) {
    if (err) {
      console.log("GET - especie " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }
    
    console.log("GET - especie " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
    return res.status(200).send({
      status: 1,
      message: result[0].nome_especie
    });
  });
});

module.exports = router;

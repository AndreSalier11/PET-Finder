import express, { Request, Response, Router } from "express";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
import { Connection } from "mysql";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");


router.get("/:id", authenticateToken, checkRole.checkId, function(req:any, res) {
  conn.query("SELECT descricao FROM tbl_estado WHERE id_estado = ? LIMIT 1", [req.params.id], function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    return res.status(200).send({
      status: 1,
      message: result[0].descricao
    });
  });
});

module.exports = router;

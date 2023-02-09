import express, { Request, Response, Router } from "express";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
import { Connection } from "mysql";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");


router.get("/:id", authenticateToken, checkRole.checkUser, checkRole.checkId, function (req: any, res) {
  conn.query(
    "SELECT fk_role FROM tbl_user WHERE id_user = ? LIMIT 1",
    [req.params.id],
    function (err, result) {
      if (err) {
        console.log("GET - role " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
        return res.sendStatus(500);
      }

      conn.query("SELECT role FROM tbl_roles WHERE id_roles = ? LIMIT 1",
      [result[0].fk_role],
      function(err, result) {
        if (err) {
          console.log("GET - role " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
          return res.sendStatus(500);
        }

        console.log("GET - role " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
        return res.status(200).send({
          status: 1,
          message: result[0].role
        });
      });
    }
  );
});

module.exports = router;
import express, { Response, Router } from "express";
import { Connection } from "mysql";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");

const validIdRegex = /^[0-9]*$/;

function checkId(id: string, res: Response) {
  if (!id.match(validIdRegex)) {
    return res.status(200).send({
      status: 0,
      message: "Insira um Id Válido",
    });
  }
}

// devolve todos os users
router.get("/", authenticateToken, function (req, res) {
  conn.query(
    "SELECT id_user, nome, data_registo, profile_image, fk_estado FROM tbl_user",
    function (err, result) {
      if (err) {
        return res.status(500).send({
          status: 0,
          message: "Internal server error",
        });
      }

      res.status(200).json(result);
    }
  );
});

// devolve o user do id
router.get("/:id", function (req, res) {
  checkId(req.params.id, res);

  conn.query(
    "SELECT id_user, nome, data_registo, profile_image, fk_estado FROM tbl_user WHERE id_user = ?",
    [req.params.id],
    function (err, result) {
      if (err) {
        return res.status(500).send({
          status: 0,
          message: "Internal server error",
        });
      }

      if (result.length == 0) {
        res.status(200).send("Não foi econtrado um User com esse id");
      }

      res.status(200).json(result[0]);
    }
  );
});

router.put("/:id", authenticateToken, checkRole.checkUser, function(req, res) {
  checkId(req.params.id, res);
});

module.exports = router;

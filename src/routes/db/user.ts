import express, { Request, Response, Router } from "express";
import { Connection } from "mysql";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
import bcrypt from "bcrypt";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");
const regex = require("../regexConfig");
const upload = require("../fileManager");


function checkId(id: string, res: Response) {
  if (!id.match(regex.validIdRegex)) {
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
        res.status(200).send({
          status: 0,
          message: "Não foi econtrado um User com esse id",
        });
      }

      res.status(200).json(result[0]);
    }
  );
});

router.put(
  "/:id",
  authenticateToken,
  checkRole.checkUser,
  upload.file.single("profile_photo"),
  async function (req: any, res) {
    checkId(req.params.id, res);

    if (req.fileValidationError) {
      return res.status(200).send({
        status: 0,
        message: req.fileValidationError
      });
    }
    
    let nome: string | undefined;
    let email: string | undefined;
    let password: any;
    let profile_image: string | undefined;
    let nr_contribuinte: string | undefined;
    let fk_morada: string | undefined;

    await new Promise((resolve, reject) => {
      conn.query(
        "SELECT nome, email, password, profile_image, nr_contribuinte, fk_morada FROM tbl_user WHERE id_user = ? LIMIT 1",
        [req.dataUser.id_user],
        function (err, result) {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    })
      .then((result: any) => {
        nome = req.body.nome ? req.body.nome : result[0].nome;
        email = req.body.email ? req.body.email : result[0].email;
        password = req.body.password ? req.body.password : result[0].password;
        profile_image = req.file
          ? req.file.filename
          : result[0].profile_image;
        nr_contribuinte = req.body.nr_contribuinte
          ? req.body.nr_contribuinte
          : result[0].nr_contribuinte;
      })
      .catch((err) => {
        return res.status(500).send({
          status: 0,
          message: "Internal server error",
        });
      });

    console.log(nome, email, password, profile_image, nr_contribuinte);

    conn.query(
      "UPDATE tbl_user SET nome = ?, email = ?, password = ?, profile_image = ?, nr_contribuinte = ?, fk_morada = ? WHERE id_user = ?",
      [
        nome,
        email,
        await bcrypt.hash(password, 10),
        profile_image,
        nr_contribuinte,
        fk_morada,
        req.dataUser.id_user,
      ],
      function (err, result) {
        if (err) {
          return res.status(500).send({
            status: 0,
            message: "Internal server errorr",
          });
        }

        return res.status(200).send({
          status: 1,
          message: "A conta foi atualizada",
        });
      }
    );
  }
);

router.delete(
  "/:id",
  authenticateToken,
  checkRole.checkUser,
  function (req: any, res) {
    checkId(req.params.id, res);

    conn.query(
      "UPDATE tbl_user SET fk_estado = ? WHERE id_user = ?",
      [2 /*Apagado*/, req.dataUser.id_user],
      function (err, result) {
        if (err) {
          return res.status(500).send({
            status: 0,
            message: "Internal server error",
          });
        }

        return res.status(200).send({
          status: 1,
          message: "A conta foi apagada",
        });
      }
    );
  }
);

module.exports = router;

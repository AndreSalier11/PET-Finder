import express, { Request, Response, Router } from "express";
import { Connection } from "mysql";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
import bcrypt from "bcrypt";
import config from "../../config";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");
const jwt = require("jsonwebtoken");
const upload = require("../fileManager");


// devolve todos os users
router.get("/", authenticateToken, function (req: any, res) {
  conn.query(
    "SELECT id_user, nome, data_registo, profile_image, fk_estado FROM tbl_user",
    function (err, result) {
      if (err) {
        console.log("GET - user - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
        return res.sendStatus(500);
      }

      console.log("GET - user - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 200");
      res.status(200).json(result);
    }
  );
});

// devolve o user do id
router.get("/:id", checkRole.checkId, function (req: any, res) {
  conn.query(
    "SELECT id_user, nome, data_registo, profile_image, fk_estado FROM tbl_user WHERE id_user = ? LIMIT 1",
    [req.params.id],
    function (err, result) {
      if (err) {
        console.log("GET - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
        return res.sendStatus(500);
      }

      if (result.length == 0) {
        console.log("GET - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 2");
        res.status(200).send({
          status: 2,
          message: "Não foi econtrado um User com esse id",
        });
      }

      console.log("GET - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 200");
      res.status(200).json(result[0]);
    }
  );
});

router.put(
  "/:id",
  authenticateToken,
  checkRole.checkUser,
  checkRole.checkId,
  upload.file.single("image"),
  async function (req: any, res) {
    if (req.fileValidationError) {
      console.log("PUT - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 3");
      return res.status(200).send({
        status: 3,
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
        console.log("PUT - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
        return res.sendStatus(500);
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
      async function (err, result) {
        if (err) {
          console.log("PUT - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
          return res.sendStatus(500);
        }

        let token = await jwt.sign(
          { id_user: result[0].id_user, nome: result[0].nome },
          config.SECRETKEY,
          { expiresIn: "1d" },
          (err: string, token: string) => {
            if (err) {
              console.log("PUT - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
              return res.sendStatus(500);
            }
            console.log("PUT - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
            return res.status(200).send({
              status: 1,
              message: "A conta foi atualizada",
              token: token,
            });
          }
        );
      }
    );
  }
);

router.delete(
  "/:id",
  authenticateToken,
  checkRole.checkUser,
  checkRole.checkId,
  function (req: any, res) {
    conn.query(
      "UPDATE tbl_user SET fk_estado = ? WHERE id_user = ?",
      [2 /*Apagado*/, req.dataUser.id_user],
      function (err, result) {
        if (err) {
          console.log("DELETE - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
          return res.sendStatus(500);
        }

        console.log("DELETE - user " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
        return res.status(200).send({
          status: 1,
          message: "A conta foi apagada",
        });
      }
    );
  }
);

module.exports = router;

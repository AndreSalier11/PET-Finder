import express, { Router } from "express";
import { Connection } from "mysql";
import config from "../../config";
import bcrypt from "bcrypt";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");
const jwt = require("jsonwebtoken");
const regex = require("../regexConfig");

router.post("/", async function (req, res) {
  const email: string = req.body.email;
  const password: string = req.body.password;

  if (!email) {
    return res.status(200).send({
      status: 0,
      message: "Insira um Email",
    });
  } else if (!email.match(regex.validEmailRegex)) {
    return res.status(200).send({
      status: 0,
      message: "Insira um Email Válido",
    });
  } else if (!password) {
    return res.status(200).send({
      status: 0,
      message: "Insira uma Password",
    });
  }

  conn.query(
    "SELECT id_user, nome, email, password, fk_estado FROM tbl_user WHERE email = ? LIMIT 1",
    [email],
    async function (err, result) {
      if (err) {
        return res.sendStatus(500);
      }

      if (result.length == 0 || result[0].fk_estado == 2) {
        return res.status(200).send({
          status: 0,
          message: "A Conta não foi Encontrada",
        });
      }

      if (await bcrypt.compare(password, result[0].password)) {
        let token = await jwt.sign(
          { id_user: result[0].id_user, nome: result[0].nome },
          config.SECRETKEY,
          { expiresIn: "1d" },
          (err: string, token: string) => {
            if (err) {
              return res.sendStatus(500);
            }
            res.status(200).send({
              status: 1,
              message: "Login Feito",
              token: token,
            });
          }
        );
      } else {
        res.status(200).send({
          status: 0,
          message: "Email ou Password Errados!",
        });
      }
    }
  );
});

module.exports = router;

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
    console.log("POST - login - 2");
    return res.status(200).send({
      status: 2,
      message: "Insira um Email",
    });
  } else if (!email.match(regex.validEmailRegex)) {
    console.log("POST - login - 3");
    return res.status(200).send({
      status: 3,
      message: "Insira um Email Válido",
    });
  } else if (!password) {
    console.log("POST - login - 4");
    return res.status(200).send({
      status: 4,
      message: "Insira uma Password",
    });
  }

  conn.query(
    "SELECT id_user, nome, email, password, fk_estado FROM tbl_user WHERE email = ? LIMIT 1",
    [email],
    async function (err, result) {
      if (err) {
        console.log("POST - login - 500");
        return res.sendStatus(500);
      }

      if (result.length == 0 || result[0].fk_estado == 2) {
        console.log("POST - login - 5");
        return res.status(200).send({
          status: 5,
          message: "A Conta não foi Encontrada",
        });
      }

      if (await bcrypt.compare(password, result[0].password)) {
        let token = await jwt.sign(
          { id_user: result[0].id_user, nome: result[0].nome },
          config.SECRETKEY,
          { expiresIn: "7d" },
          (err: string, token: string) => {
            if (err) {
              return res.sendStatus(500);
            }
            console.log("POST - login - 1");
            res.status(200).send({
              status: 1,
              message: "Login Feito",
              token: token,
            });
          }
        );
      } else {
        console.log("POST - login - 6");
        res.status(200).send({
          status: 6,
          message: "Email ou Password Errados!",
        });
      }
    }
  );
});

module.exports = router;

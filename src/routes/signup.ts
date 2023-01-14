import express, { Router } from "express";
import { Connection } from "mysql";
import config from "../config";
import bcrypt from "bcrypt";

const router: Router = express.Router();
const conn: Connection = require("../db_conn");
const jwt = require("jsonwebtoken");

const validRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

router.post("/", async function (req, res) {
  const email: string = req.body.email;
  const password: string = req.body.password;

  if (!email) {
    return res.status(200).send({
      status: 0,
      message: "Insira um Email",
    });
  } else if (!email.match(validRegex)) {
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
    "SELECT email, password FROM tbl_user WHERE email = ? LIMIT 1",
    [email],
    async function (err, result) {
      if (err) {
        return res.status(500).send({
          status: 0,
          message: "Internal server error",
        });
      }

      if (result.length == 0) {
        return res.status(200).send({
          status: 0,
          message: "A Conta não foi Encontrada",
        });
      }

      if (await bcrypt.compare(password, result[0].password)) {
        await jwt.sign(
          { email: email },
          config.SECRETKEY,
          { expiresIn: "3d" },
          (err: string, token: string) => {
            res.status(200).send({
              status: 1,
              message: "Login Feito",
              token: token
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

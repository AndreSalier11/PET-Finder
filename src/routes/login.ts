import express, { Router } from "express";
import { Connection } from "mysql";
import config from "../config";
import bcrypt from "bcrypt";

// https://medium.com/@onejohi/securing-your-express-restful-apis-using-json-web-tokens-8c2fff0f4e7f

const router: Router = express.Router();
const conn: Connection = require("../db_conn");
const jwt = require("jsonwebtoken");

const validRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

router.post("/", async function (req, res) {
  const email: string = req.body.email;
  const password: string = req.body.password;

  if (email && password && email.match(validRegex)) {
    console.log(1);
    conn.query(
      "SELECT email, password FROM petfinder_db.tbl_user WHERE email = ? LIMIT 1",
      [email],
      async function (err, result) {
        console.log(2);

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
          let token = await jwt.sign(
            {
              email: email,
            },
            config.SECRETKEY,
            (err: any, token: any) => {
              res.status(200).send({
                status: 1,
                message: "Login Feito",
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
  } else {
    res.status(200).send({
      status: 0,
      message: "Insira um Email Válido",
    });
  }
});

module.exports = router;

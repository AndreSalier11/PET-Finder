import express, { Router } from "express";
import { Connection } from "mysql";
import bcrypt from "bcrypt";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");
const regex = require("../regexConfig");
const upload = require("../fileManager");

async function insertAdmin() {
  conn.query(
    "INSERT INTO tbl_user (nome, email, password, fk_role, fk_estado) VALUES ('André', 'andresalier11@gmail.com', '" + await bcrypt.hash("12345", 10) + "', 2, 1)",
    async function (err, result) {
      if (err) {
        return console.log(err)
      }
      console.log("admin added")
    }
  );
}

//insertAdmin();

router.post("/", upload.file.single("profile_photo"), async function (req: any, res) {
  
  if (req.fileValidationError) {
    return res.status(200).send({
      status: 0,
      message: req.fileValidationError
    });
  }

  const nome: string = req.body.nome;
  const email: string = req.body.email;
  const password: string = req.body.password;
  const profile_image: string | undefined = req.file ? req.file.filename : undefined;
  const nr_contribuinte: string | undefined = req.body.nr_contribuinte;

  const role = 1; //Cliente
  const estado = 1; //Existente

  if (!nome) {
    return res.status(200).send({
      status: 2,
      message: "Insira um Nome",
    });
  }
  if (!nome.match(regex.validNomeRegex)) {
    return res.status(200).send({
      status: 3,
      message: "O nome não pode ter caracteres especiais",
    });
  }
  if (!email) {
    return res.status(200).send({
      status: 4,
      message: "Insira um Email",
    });
  } else if (!email.match(regex.validEmailRegex)) {
    return res.status(200).send({
      status: 5,
      message: "Insira um Email Válido",
    });
  } else if (!password) {
    return res.status(200).send({
      status: 6,
      message: "Insira uma Password",
    });
  }

  conn.query(
    "SELECT email FROM tbl_user WHERE email = ? LIMIT 1",
    [email],
    async function (err, result) {
      if (err) {
        return res.sendStatus(500);
      }

      if (result.length > 0) {
        return res.status(200).send({
          status: 7,
          message: "Esse email já está registado",
        });
      }

      conn.query(
        "INSERT INTO tbl_user (nome, email, password, profile_image, nr_contribuinte, fk_role, fk_estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          nome,
          email,
          await bcrypt.hash(password, 10),
          profile_image,
          nr_contribuinte,
          role,
          estado,
        ],
        async function (err, result) {
          if (err) {
            return res.sendStatus(500);
          }

          res.status(200).send({
            status: 1,
            message: "Registo Feito",
          });
        }
      );
    }
  );
});

module.exports = router;

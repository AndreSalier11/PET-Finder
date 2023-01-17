import express, { Request, Response, Router } from "express";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
import { Connection } from "mysql";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");
const regex = require("../regexConfig");


router.get("/:id", authenticateToken, checkRole.checkId, function(req:any, res) {
  conn.query("SELECT fk_user, fk_animal FROM tbl_relacao_favorito WHERE id_relacao = ? LIMIT 1", [req.params.id], function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    if(req.dataUser.id_user != result[0].fk_user) {
      return res.sendStatus(403);
    }

    return res.status(200).send({
      status: 1,
      message: result[0].fk_user + ", " + result[0].fk_animal
    });
  });
});

router.post("/", authenticateToken, function(req:any, res) {
  const fk_user = req.body.fk_user;
  const fk_animal = req.body.fk_animal;

  if(!fk_user) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir o id do user" 
    });

  } else if(!fk_user.match(regex.validIdRegex)) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir um id do user valido" 
    });

  } else if(!fk_animal) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir o id do animal" 
    });

  } else if(!fk_animal.match(regex.validIdRegex)) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir um id do animal valido" 
    });

  } else if(req.dataUser.id_user != fk_user) {
    return res.sendStatus(403);
  }

  conn.query("INSERT INTO tbl_relacao_favorito (fk_user, fk_animal) VALUES (?, ?)", [fk_user, fk_animal], function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    return res.status(200).send({
      status: 1,
      message: "Relacao inserida"
    });
  })
});

router.delete("/:id", authenticateToken, checkRole.checkId, function(req:any, res) {
  conn.query("DELETE tbl_relacao_favorito WHERE id_relacao = ?", [req.params.id], function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    return res.status(200).send({
      status: 1,
      message: "Relacao apagada"
    });
  })
});
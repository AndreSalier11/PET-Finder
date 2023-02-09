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
      console.log("GET - favorito " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    if(req.dataUser.id_user != result[0].fk_user) {
      console.log("GET - favorito " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 403");
      return res.sendStatus(403);
    }

    console.log("GET - favorito " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 200");
    res.status(200).json(result[0]);
  });
});

router.post("/", authenticateToken, function(req:any, res) {
  const fk_user = req.body.fk_user;
  const fk_animal = req.body.fk_animal;

  if(!fk_user) {
    console.log("POST - favorito - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 2");
    return res.status(200).send({
      status: 2,
      message: "Tem de inserir o id do user" 
    });

  } else if(!fk_user.match(regex.validIdRegex)) {
    console.log("POST - favorito - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 3");
    return res.status(200).send({
      status: 3,
      message: "Tem de inserir um id do user valido" 
    });

  } else if(!fk_animal) {
    console.log("POST - favorito - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 4");
    return res.status(200).send({
      status: 4,
      message: "Tem de inserir o id do animal" 
    });

  } else if(!fk_animal.match(regex.validIdRegex)) {
    console.log("POST - favorito - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 5");
    return res.status(200).send({
      status: 5,
      message: "Tem de inserir um id do animal valido" 
    });

  } else if(req.dataUser.id_user != fk_user) {
    console.log("POST - favorito - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 403");
    return res.sendStatus(403);
  }

  conn.query("INSERT INTO tbl_relacao_favorito (fk_user, fk_animal) VALUES (?, ?)", [fk_user, fk_animal], function(err, result) {
    if (err) {
      console.log("POST - favorito - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    console.log("POST - favorito - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
    return res.status(200).send({
      status: 1,
      message: "Relacao inserida"
    });
  })
});

router.delete("/:id", authenticateToken, checkRole.checkId, function(req:any, res) {
  conn.query("DELETE tbl_relacao_favorito WHERE id_relacao = ?", [req.params.id], function(err, result) {
    if (err) {
      console.log("DELETE - favorito " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    console.log("DELETE - favorito " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
    return res.status(200).send({
      status: 1,
      message: "Relacao apagada"
    });
  })
});

module.exports = router;
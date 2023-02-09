import express, { Request, Response, Router } from "express";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
import { Connection } from "mysql";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");
const regex = require("../regexConfig");

router.get("/:id", authenticateToken, checkRole.checkId, function(req:any, res) {
  conn.query("SELECT descricao, montante, data, fk_tipo_pagamento, fk_user FROM tbl_faturas WHERE id_faturas = ? LIMIT 1", [req.params.id], function(err, result) {
    if (err) {
      console.log("GET - fatura " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    if(req.dataUser.id_user != result[0].fk_user) {
      console.log("GET - fatura " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 403");
      return res.sendStatus(403);
    }

    console.log("GET - fatura " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 200");
    res.status(200).json(result[0]);
  });
});

router.post("/", authenticateToken, function(req:any, res) {
  const descricao = req.body.descricao;
  const montante = req.body.montante;
  const data = req.body.data;
  const fk_tipo_pagamento = req.body.fk_tipo_pagamento;
  const fk_user = req.body.fk_user;

  if(!descricao) {
    console.log("POST - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 2");
    return res.status(200).send({
      status: 2,
      message: "Tem de inserir a descricao" 
    });

  } else if(!montante) {
    console.log("POST - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 3");
    return res.status(200).send({
      status: 3,
      message: "Tem de inserir o montante" 
    });

  } else if(!data) {
    console.log("POST - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 4");
    return res.status(200).send({
      status: 4,
      message: "Tem de inserir a data" 
    });

  } else if(!fk_tipo_pagamento) {
    console.log("POST - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 5");
    return res.status(200).send({
      status: 5,
      message: "Tem de inserir o tipo de pagamento" 
    });

  } else if(fk_user) {
    console.log("POST - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 6");
    return res.status(200).send({
      status: 6,
      message: "Tem de inserir o id do user" 
    });

  } else if(req.dataUser.id_user != fk_user) {
    console.log("POST - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 403");
    return res.sendStatus(403);
  }

  conn.query("INSERT INTO tbl_faturas (descricao, montante, data, fk_tipo_pagamento, fk_user) VALUES (?, ?, ?, ?, ?)", [descricao, montante, data, fk_tipo_pagamento, fk_user], function(err, result) {
    if (err) {
      console.log("POST - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    console.log("POST - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
    return res.status(200).send({
      status: 1,
      message: "Fatura inserida"
    });
  })
});

router.get("/tipo-pagamento/:id", authenticateToken, checkRole.checkId, function(req:any, res) {
  conn.query("SELECT descricao, FROM tbl_faturas WHERE id_tipo_pagamento = ? LIMIT 1", [req.params.id], function(err, result) {
    if (err) {
      console.log("GET - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    console.log("GET - fatura - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
    return res.status(200).send({
      status: 1,
      message: result[0].descricao
    });
  });
});

module.exports = router;
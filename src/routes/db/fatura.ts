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
      return res.sendStatus(500);
    }

    if(req.dataUser.id_user != result[0].fk_user) {
      return res.sendStatus(403);
    }

    return res.status(200).send({
      status: 1,
      message: result[0].descricao + ", " + result[0].montante + ", " + result[0].data + ", " + result[0].fk_tipo_pagamento + ", " + result[0].fk_user
    });
  });
});

router.post("/", authenticateToken, function(req:any, res) {
  const descricao = req.body.descricao;
  const montante = req.body.montante;
  const data = req.body.data;
  const fk_tipo_pagamento = req.body.fk_tipo_pagamento;
  const fk_user = req.body.fk_user;

  if(!descricao) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir a descricao" 
    });

  } else if(!montante) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir o montante" 
    });

  } else if(!data) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir a data" 
    });

  } else if(!fk_tipo_pagamento) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir o tipo de pagamento" 
    });

  } else if(fk_user) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir o id do user" 
    });

  } else if(req.dataUser.id_user != fk_user) {
    return res.sendStatus(403);
  }

  conn.query("INSERT INTO tbl_faturas (descricao, montante, data, fk_tipo_pagamento, fk_user) VALUES (?, ?, ?, ?, ?)", [descricao, montante, data, fk_tipo_pagamento, fk_user], function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    return res.status(200).send({
      status: 1,
      message: "Fatura inserida"
    });
  })
});
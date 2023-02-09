import express, { Request, Response, Router } from "express";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
import { Connection } from "mysql";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");
const regex = require("../regexConfig");


router.get("/:id", authenticateToken, checkRole.checkId, function(req: any, res) {
  conn.query("SELECT morada, latitude, longitude, raio FROM tbl_local WHERE id_local = ? LIMIT 1", [req.params.id], function(err, result) {
    if (err) {
      console.log("GET - local " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    console.log("GET - local " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 200");
    res.status(200).json(result[0]);
  });
})

router.post("/", authenticateToken, checkRole.checkUserLocal, function(req: any, res) {
  const morada = req.body.morada;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const raio = req.body.raio;

  if(!latitude) {
    console.log("POST - local - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 2");
    return res.status(200).send({
      status: 2,
      message: "Tem de inserir a latitude" 
    });

  } else if(!latitude.match(regex.validCoordinate)) {
    console.log("POST - local - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 3");
    return res.status(200).send({
      status: 3,
      message: "Tem de inserir uma latitude valida" 
    });

  } else if(!longitude) {
    console.log("POST - local - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 4");
    return res.status(200).send({
      status: 4,
      message: "Tem de inserir a longitude" 
    });

  } else if(!longitude.match(regex.validCoordinate)) {
    console.log("POST - local - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 5");
    return res.status(200).send({
      status: 5,
      message: "Tem de inserir uma longitude valida" 
    });
  }

  conn.query("INSERT INTO tbl_local (morada, latitude, longitude, raio) VALUES (?, ?, ?, ?)", [morada, latitude, longitude, raio], function(err, result) {
    if (err) {
      console.log("POST - local - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    console.log("POST - local - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
    return res.status(200).send({
      status: 1,
      message: "Local inserido" 
    });
  });
});

router.put("/:id", authenticateToken, checkRole.checkId, checkRole.checkUserLocal, function(req: any, res) {
  conn.query("SELECT morada, latitude, longitude, raio FROM tbl_local WHERE id_local = ? LIMIT 1", [req.params.id], function(err, result) {
    if (err) {
      console.log("PUT - local " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    let morada = req.body.morada ? req.body.morada : result[0].morada;
    let latitude = req.body.latitude ? req.body.latitude : result[0].latitude;
    let longitude = req.body.longitude ? req.body.longitude : result[0].longitude;
    let raio = req.body.raio ? req.body.raio : result[0].raio;

    conn.query("UPDATE tbl_local SET morada = ?, latitude = ?, longitude = ?, raio = ? WHERE id_local = ?", [morada, latitude, longitude, raio, req.params.id], function(err, result) {
      if (err) {
        console.log("PUT - local " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
        return res.sendStatus(500);
      }
  
      console.log("PUT - local " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
      return res.status(200).send({
        status: 1,
        message: "Local inserido" 
      });
    });
  });
});

router.delete(":id", authenticateToken, checkRole.checkId, checkRole.checkUserLocal, function(req: any, res) {
  conn.query("DELETE FROM tbl_local WHERE id_local = ?", [req.params.id], function(err, result) {
    if (err) {
      console.log("DELETE - local " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
      return res.sendStatus(500);
    }

    console.log("DELETE - local " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
    return res.status(200).send({
      status: 1,
      message: "Local apagado" 
    });
  })
});

module.exports = router;
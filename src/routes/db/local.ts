import express, { Request, Response, Router } from "express";
import authenticateToken from "../../authToken";
import checkRole from "../../checkRole";
import { Connection } from "mysql";
const router: Router = express.Router();
const conn: Connection = require("../../db_conn");
const regex = require("../regexConfig");


router.get("/:id", authenticateToken, checkRole.checkId, function(req, res) {
  conn.query("SELECT morada, latitude, longitude, raio FROM tbl_local WHERE id_local = ? LIMIT 1", [req.params.id], function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    res.status(200).json(result[0]);
  });
})

router.post("/", authenticateToken, checkRole.checkUserLocal, function(req, res) {
  const morada = req.body.morada;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const raio = req.body.raio;

  if(!latitude) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir a latitude" 
    });

  } else if(!latitude.match(regex.validCoordinate)) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir uma latitude valida" 
    });

  } else if(!longitude) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir a longitude" 
    });

  } else if(!longitude.match(regex.validCoordinate)) {
    return res.status(200).send({
      status: 0,
      message: "Tem de inserir uma longitude valida" 
    });
  }

  conn.query("INSERT INTO tbl_local (morada, latitude, longitude, raio) VALUES (?, ?, ?, ?)", [morada, latitude, longitude, raio], function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    return res.status(200).send({
      status: 1,
      message: "Local inserido" 
    });
  });
});

router.put("/:id", authenticateToken, checkRole.checkId, checkRole.checkUserLocal, function(req, res) {
  conn.query("SELECT morada, latitude, longitude, raio FROM tbl_local WHERE id_local = ? LIMIT 1", [req.params.id], function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    let morada = req.body.morada ? req.body.morada : result[0].morada;
    let latitude = req.body.latitude ? req.body.latitude : result[0].latitude;
    let longitude = req.body.longitude ? req.body.longitude : result[0].longitude;
    let raio = req.body.raio ? req.body.raio : result[0].raio;

    conn.query("UPDATE tbl_local SET morada = ?, latitude = ?, longitude = ?, raio = ? WHERE id_local = ?", [morada, latitude, longitude, raio, req.params.id], function(err, result) {
      if (err) {
        return res.sendStatus(500);
      }
  
      return res.status(200).send({
        status: 1,
        message: "Local inserido" 
      });
    });
  });
});

router.delete(":id", authenticateToken, checkRole.checkId, checkRole.checkUserLocal, function(req, res) {
  conn.query("DELETE FROM tbl_local WHERE id_local = ?", [req.params.id], function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    return res.status(200).send({
      status: 1,
      message: "Local apagado" 
    });
  })
});
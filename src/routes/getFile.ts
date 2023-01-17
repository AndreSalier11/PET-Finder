import express, { Request, Response, Router } from "express";
import authenticateToken from "../authToken";
const router: Router = express.Router();

router.get("/user_img", authenticateToken, function(req, res) {
  const img = req.body.img;

  if(req.body.img) {
    res.status(200).sendFile("/user_img/" + img, function(err) {
      res.status(404).send({
        status: 0,
        message: "A imagem pela qual procura não se encontra disponivel",
      });
    });
  } else {
    res.status(200).send({
      status: 0,
      message: "Qual é a imagem que precisa?",
    });
  }
});

router.get("/animal_img", authenticateToken, function(req, res) {
  const img = req.body.img;

  if(req.body.img) {
    res.status(200).sendFile("/animal_img/" + img, function(err) {
      res.status(404).send({
        status: 0,
        message: "A imagem pela qual procura não se encontra disponivel",
      });
    });
  } else {
    res.status(200).send({
      status: 0,
      message: "Qual é a imagem que precisa?",
    });
  }
});
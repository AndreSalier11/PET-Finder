import express, { Request, Response, Router } from "express";
import authenticateToken from "../authToken";
import path from "path";
const router: Router = express.Router();

router.get("/user_img", authenticateToken, function(req, res) {
  const img = req.body.img;

  var options = {
    root: path.join(__dirname + "/../../data/user_img/")
  };

  if(req.body.img) {
    res.status(200).sendFile(img, options, function(err) {
      if(err) {
        return res.status(404).send({
          status: 2,
          message: "A imagem pela qual procura não se encontra disponivel",
        });
      }
    });
  } else {
    res.status(200).send({
      status: 3,
      message: "Qual é a imagem que precisa?",
    });
  }
});

router.get("/animal_img", authenticateToken, function(req, res) {
  const img = req.body.img;

  var options = {
    root: path.join(__dirname + "/../../data/animal_img/")
  };

  if(req.body.img) {
    res.status(200).sendFile(img, options, function(err) {
      if(err) {
        return res.status(404).send({
          status: 2,
          message: "A imagem pela qual procura não se encontra disponivel",
        });
      }
    });
  } else {
    res.status(200).send({
      status: 3,
      message: "Qual é a imagem que precisa?",
    });
  }
});

module.exports = router;
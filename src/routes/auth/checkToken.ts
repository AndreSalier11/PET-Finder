import express, { Router } from "express";
import config from "../../config";
const jwt = require("jsonwebtoken");
const router: Router = express.Router();

router.get("/", function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  jwt.verify(token, config.SECRETKEY, (err: any, user: any) => {
    if (err) {
      console.log("GET - checkToken - 2");
      return res.status(200).send({
        status: 2,
        message: "Token Inválida",
      });
    }
    console.log("GET - checkToken - 1");
    return res.status(200).send({
      status: 1,
      message: "Token Válida",
    });
  });
});

module.exports = router;

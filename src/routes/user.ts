import express, { Router } from "express";
import authenticateToken from "../authToken";
const router: Router = express.Router();
const conn = require("../db_conn");

// devolve todos os users
router.get("/", authenticateToken, function (req, res) {
  res.send("USEREEEE");
});

// devolve o user do id
router.get("/:id", function (req, res) {
  
});



module.exports = router;

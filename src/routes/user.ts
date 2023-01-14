import express, { Router } from "express";
const router: Router = express.Router();
const conn = require("../db_conn");

// devolve todos os users
router.get("/", function (req, res) {

});

// devolve o user do id
router.get("/:id", function (req, res) {
  
});



module.exports = router;

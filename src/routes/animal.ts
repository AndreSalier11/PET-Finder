import express, { Router } from "express";
const router: Router = express.Router();
const conn = require("../db_conn");

router.get("/", function (req, res) {});

module.exports = router;

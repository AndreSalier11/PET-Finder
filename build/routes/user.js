"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authToken_1 = __importDefault(require("../authToken"));
const router = express_1.default.Router();
const conn = require("../db_conn");
// devolve todos os users
router.get("/", authToken_1.default, function (req, res) {
    res.send("USEREEEE");
});
// devolve o user do id
router.get("/:id", function (req, res) {
});
module.exports = router;

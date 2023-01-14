"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const conn = require("../db_conn");
// devolve todos os users
router.get("/", function (req, res) {
});
// devolve o user do id
router.get("/:id", function (req, res) {
});
module.exports = router;

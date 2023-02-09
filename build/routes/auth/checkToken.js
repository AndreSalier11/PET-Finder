"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../../config"));
const jwt = require("jsonwebtoken");
const router = express_1.default.Router();
router.get("/", function (req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, config_1.default.SECRETKEY, (err, user) => {
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

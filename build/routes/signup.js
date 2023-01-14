"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const conn = require("../db_conn");
const jwt = require("jsonwebtoken");
const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        if (!email) {
            return res.status(200).send({
                status: 0,
                message: "Insira um Email",
            });
        }
        else if (!email.match(validRegex)) {
            return res.status(200).send({
                status: 0,
                message: "Insira um Email Válido",
            });
        }
        else if (!password) {
            return res.status(200).send({
                status: 0,
                message: "Insira uma Password",
            });
        }
        conn.query("SELECT email, password FROM tbl_user WHERE email = ? LIMIT 1", [email], function (err, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(500).send({
                        status: 0,
                        message: "Internal server error",
                    });
                }
                if (result.length == 0) {
                    return res.status(200).send({
                        status: 0,
                        message: "A Conta não foi Encontrada",
                    });
                }
                if (yield bcrypt_1.default.compare(password, result[0].password)) {
                    yield jwt.sign({ email: email }, config_1.default.SECRETKEY, { expiresIn: "3d" }, (err, token) => {
                        res.status(200).send({
                            status: 1,
                            message: "Login Feito",
                            token: token
                        });
                    });
                }
                else {
                    res.status(200).send({
                        status: 0,
                        message: "Email ou Password Errados!",
                    });
                }
            });
        });
    });
});
module.exports = router;

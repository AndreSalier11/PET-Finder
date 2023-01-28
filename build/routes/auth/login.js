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
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const conn = require("../../db_conn");
const jwt = require("jsonwebtoken");
const regex = require("../regexConfig");
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        if (!email) {
            return res.status(200).send({
                status: 2,
                message: "Insira um Email",
            });
        }
        else if (!email.match(regex.validEmailRegex)) {
            return res.status(200).send({
                status: 3,
                message: "Insira um Email Válido",
            });
        }
        else if (!password) {
            return res.status(200).send({
                status: 4,
                message: "Insira uma Password",
            });
        }
        conn.query("SELECT id_user, nome, email, password, fk_estado FROM tbl_user WHERE email = ? LIMIT 1", [email], function (err, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.sendStatus(500);
                }
                if (result.length == 0 || result[0].fk_estado == 2) {
                    return res.status(200).send({
                        status: 5,
                        message: "A Conta não foi Encontrada",
                    });
                }
                if (yield bcrypt_1.default.compare(password, result[0].password)) {
                    let token = yield jwt.sign({ id_user: result[0].id_user, nome: result[0].nome }, config_1.default.SECRETKEY, { expiresIn: "1d" }, (err, token) => {
                        if (err) {
                            return res.sendStatus(500);
                        }
                        res.status(200).send({
                            status: 1,
                            message: "Login Feito",
                            token: token,
                        });
                    });
                }
                else {
                    res.status(200).send({
                        status: 6,
                        message: "Email ou Password Errados!",
                    });
                }
            });
        });
    });
});
module.exports = router;

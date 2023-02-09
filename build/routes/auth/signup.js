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
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const conn = require("../../db_conn");
const regex = require("../regexConfig");
const upload = require("../fileManager");
function insertAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        conn.query("INSERT INTO tbl_user (nome, email, password, fk_role, fk_estado) VALUES ('André', 'andresalier11@gmail.com', '" + (yield bcrypt_1.default.hash("12345", 10)) + "', 2, 1)", function (err, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return console.log(err);
                }
                console.log("admin added");
            });
        });
    });
}
//insertAdmin();
router.post("/", upload.file.single("image"), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.fileValidationError) {
            console.log("POST - signup - 8");
            return res.status(200).send({
                status: 8,
                message: req.fileValidationError
            });
        }
        const nome = req.body.nome;
        const email = req.body.email;
        const password = req.body.password;
        const profile_image = req.file ? req.file.filename : undefined;
        const nr_contribuinte = req.body.nr_contribuinte;
        const role = 1; //Cliente
        const estado = 1; //Existente
        if (!nome) {
            console.log("POST - signup - 2");
            return res.status(200).send({
                status: 2,
                message: "Insira um Nome",
            });
        }
        if (!nome.match(regex.validNomeRegex)) {
            console.log("POST - signup - 3");
            return res.status(200).send({
                status: 3,
                message: "O nome não pode ter caracteres especiais",
            });
        }
        if (!email) {
            console.log("POST - signup - 4");
            return res.status(200).send({
                status: 4,
                message: "Insira um Email",
            });
        }
        else if (!email.match(regex.validEmailRegex)) {
            console.log("POST - signup - 5");
            return res.status(200).send({
                status: 5,
                message: "Insira um Email Válido",
            });
        }
        else if (!password) {
            console.log("POST - signup - 6");
            return res.status(200).send({
                status: 6,
                message: "Insira uma Password",
            });
        }
        conn.query("SELECT email FROM tbl_user WHERE email = ? LIMIT 1", [email], function (err, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log("POST - signup - 500");
                    return res.sendStatus(500);
                }
                if (result.length > 0) {
                    console.log("POST - signup - 7");
                    return res.status(200).send({
                        status: 7,
                        message: "Esse email já está registado",
                    });
                }
                conn.query("INSERT INTO tbl_user (nome, email, password, profile_image, nr_contribuinte, fk_role, fk_estado) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                    nome,
                    email,
                    yield bcrypt_1.default.hash(password, 10),
                    profile_image,
                    nr_contribuinte,
                    role,
                    estado,
                ], function (err, result) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.log("POST - signup - 500");
                            return res.sendStatus(500);
                        }
                        console.log("POST - signup - 1");
                        res.status(200).send({
                            status: 1,
                            message: "Registo Feito",
                        });
                    });
                });
            });
        });
    });
});
module.exports = router;

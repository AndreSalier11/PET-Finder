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
const authToken_1 = __importDefault(require("../../authToken"));
const checkRole_1 = __importDefault(require("../../checkRole"));
const config_1 = __importDefault(require("../../config"));
const router = express_1.default.Router();
const conn = require("../../db_conn");
const jwt = require("jsonwebtoken");
const upload = require("../fileManager");
router.get("/", authToken_1.default, function (req, res) {
    conn.query("SELECT id_animal, nome, raca_mutacao, genero, idade, image_animal, data_estado, fk_estado, fk_especie FROM tbl_animal", function (err, result) {
        if (err) {
            console.log("GET - animal - " + req.dataUser.nome + " - 500");
            return res.sendStatus(500);
        }
        console.log("GET - animal - " + req.dataUser.nome + " - 200");
        res.status(200).json(result);
    });
});
router.get("/:id", checkRole_1.default.checkId, function (req, res) {
    conn.query("SELECT id_animal, nome, raca_mutacao, genero, idade, nota, image_animal, data_estado, fk_estado, fk_id_especie, fk_user, fk_local FROM tbl_user WHERE tbl_animal = ? LIMIT 1", [req.params.id], function (err, result) {
        if (err) {
            console.log("GET - animal " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
            return res.sendStatus(500);
        }
        if (result.length == 0) {
            console.log("GET - animal " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 2");
            res.status(200).send({
                status: 2,
                message: "Não foi econtrado um User com esse id",
            });
        }
        console.log("GET - animal " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 200");
        res.status(200).json(result[0]);
    });
});
router.put("/:id", authToken_1.default, checkRole_1.default.checkId, upload.file.single("animal_photo"), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.fileValidationError) {
            console.log("PUT - animal " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 2");
            return res.status(200).send({
                status: 2,
                message: req.fileValidationError
            });
        }
        let nome;
        let email;
        let password;
        let profile_image;
        let nr_contribuinte;
        let fk_morada;
        yield new Promise((resolve, reject) => {
            conn.query("SELECT nome, email, password, profile_image, nr_contribuinte, fk_morada FROM tbl_user WHERE id_user = ? LIMIT 1", [req.dataUser.id_user], function (err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        })
            .then((result) => {
            nome = req.body.nome ? req.body.nome : result[0].nome;
            email = req.body.email ? req.body.email : result[0].email;
            password = req.body.password ? req.body.password : result[0].password;
            profile_image = req.file
                ? req.file.filename
                : result[0].profile_image;
            nr_contribuinte = req.body.nr_contribuinte
                ? req.body.nr_contribuinte
                : result[0].nr_contribuinte;
        })
            .catch((err) => {
            console.log("PUT - animal " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
            return res.sendStatus(500);
        });
        //console.log(nome, email, password, profile_image, nr_contribuinte);
        conn.query("UPDATE tbl_user SET nome = ?, email = ?, password = ?, profile_image = ?, nr_contribuinte = ?, fk_morada = ? WHERE id_user = ?", [
            nome,
            email,
            profile_image,
            nr_contribuinte,
            fk_morada,
            req.dataUser.id_user,
        ], function (err, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.sendStatus(500);
                }
                let token = yield jwt.sign({ id_user: result[0].id_user, nome: result[0].nome }, config_1.default.SECRETKEY, { expiresIn: "1d" }, (err, token) => {
                    if (err) {
                        console.log("PUT - animal " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
                        return res.sendStatus(500);
                    }
                    console.log("PUT - animal " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 3");
                    return res.status(200).send({
                        status: 3,
                        message: "A conta foi atualizada",
                        token: token,
                    });
                });
            });
        });
    });
});
router.delete("/:id", authToken_1.default, checkRole_1.default.checkUser, checkRole_1.default.checkId, function (req, res) {
    conn.query("UPDATE tbl_user SET fk_estado = ? WHERE id_user = ?", [2 /*Apagado*/, req.dataUser.id_user], function (err, result) {
        if (err) {
            console.log("DELETE - animal " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
            return res.sendStatus(500);
        }
        console.log("DELETE - animal " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
        return res.status(200).send({
            status: 1,
            message: "A conta foi apagada",
        });
    });
});
module.exports = router;

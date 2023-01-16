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
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const conn = require("../../db_conn");
const regex = require("../regexConfig");
function checkId(id, res) {
    if (!id.match(regex.validIdRegex)) {
        return res.status(200).send({
            status: 0,
            message: "Insira um Id Válido",
        });
    }
}
// devolve todos os users
router.get("/", authToken_1.default, function (req, res) {
    conn.query("SELECT id_user, nome, data_registo, profile_image, fk_estado FROM tbl_user", function (err, result) {
        if (err) {
            return res.status(500).send({
                status: 0,
                message: "Internal server error",
            });
        }
        res.status(200).json(result);
    });
});
// devolve o user do id
router.get("/:id", function (req, res) {
    checkId(req.params.id, res);
    conn.query("SELECT id_user, nome, data_registo, profile_image, fk_estado FROM tbl_user WHERE id_user = ?", [req.params.id], function (err, result) {
        if (err) {
            return res.status(500).send({
                status: 0,
                message: "Internal server error",
            });
        }
        if (result.length == 0) {
            res.status(200).send({
                status: 0,
                message: "Não foi econtrado um User com esse id",
            });
        }
        res.status(200).json(result[0]);
    });
});
router.put("/:id", authToken_1.default, checkRole_1.default.checkUser, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        checkId(req.params.id, res);
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
            profile_image = req.body.profile_image
                ? req.body.profile_image
                : result[0].profile_image;
            nr_contribuinte = req.body.nr_contribuinte
                ? req.body.nr_contribuinte
                : result[0].nr_contribuinte;
        })
            .catch((err) => {
            return res.status(500).send({
                status: 0,
                message: "Internal server error",
            });
        });
        console.log(nome, email, password, profile_image, nr_contribuinte);
        conn.query("UPDATE tbl_user SET nome = ?, email = ?, password = ?, profile_image = ?, nr_contribuinte = ?, fk_morada = ? WHERE id_user = ?", [
            nome,
            email,
            yield bcrypt_1.default.hash(password, 10),
            profile_image,
            nr_contribuinte,
            fk_morada,
            req.dataUser.id_user,
        ], function (err, result) {
            if (err) {
                return res.status(500).send({
                    status: 0,
                    message: "Internal server error",
                });
            }
            return res.status(200).send({
                status: 1,
                message: "A conta foi atualizada",
            });
        });
    });
});
router.delete("/:id", authToken_1.default, checkRole_1.default.checkUser, function (req, res) {
    checkId(req.params.id, res);
    conn.query("UPDATE tbl_user SET fk_estado = ? WHERE id_user = ?", [2 /*Apagado*/, req.dataUser.id_user], function (err, result) {
        if (err) {
            return res.status(500).send({
                status: 0,
                message: "Internal server error",
            });
        }
        return res.status(200).send({
            status: 1,
            message: "A conta foi apagada",
        });
    });
});
module.exports = router;

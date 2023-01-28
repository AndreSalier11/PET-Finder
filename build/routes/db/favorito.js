"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authToken_1 = __importDefault(require("../../authToken"));
const checkRole_1 = __importDefault(require("../../checkRole"));
const router = express_1.default.Router();
const conn = require("../../db_conn");
const regex = require("../regexConfig");
router.get("/:id", authToken_1.default, checkRole_1.default.checkId, function (req, res) {
    conn.query("SELECT fk_user, fk_animal FROM tbl_relacao_favorito WHERE id_relacao = ? LIMIT 1", [req.params.id], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        if (req.dataUser.id_user != result[0].fk_user) {
            return res.sendStatus(403);
        }
        res.status(200).json(result[0]);
    });
});
router.post("/", authToken_1.default, function (req, res) {
    const fk_user = req.body.fk_user;
    const fk_animal = req.body.fk_animal;
    if (!fk_user) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir o id do user"
        });
    }
    else if (!fk_user.match(regex.validIdRegex)) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir um id do user valido"
        });
    }
    else if (!fk_animal) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir o id do animal"
        });
    }
    else if (!fk_animal.match(regex.validIdRegex)) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir um id do animal valido"
        });
    }
    else if (req.dataUser.id_user != fk_user) {
        return res.sendStatus(403);
    }
    conn.query("INSERT INTO tbl_relacao_favorito (fk_user, fk_animal) VALUES (?, ?)", [fk_user, fk_animal], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        return res.status(200).send({
            status: 1,
            message: "Relacao inserida"
        });
    });
});
router.delete("/:id", authToken_1.default, checkRole_1.default.checkId, function (req, res) {
    conn.query("DELETE tbl_relacao_favorito WHERE id_relacao = ?", [req.params.id], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        return res.status(200).send({
            status: 1,
            message: "Relacao apagada"
        });
    });
});
module.exports = router;

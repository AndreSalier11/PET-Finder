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
    conn.query("SELECT descricao, montante, data, fk_tipo_pagamento, fk_user FROM tbl_faturas WHERE id_faturas = ? LIMIT 1", [req.params.id], function (err, result) {
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
    const descricao = req.body.descricao;
    const montante = req.body.montante;
    const data = req.body.data;
    const fk_tipo_pagamento = req.body.fk_tipo_pagamento;
    const fk_user = req.body.fk_user;
    if (!descricao) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir a descricao"
        });
    }
    else if (!montante) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir o montante"
        });
    }
    else if (!data) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir a data"
        });
    }
    else if (!fk_tipo_pagamento) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir o tipo de pagamento"
        });
    }
    else if (fk_user) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir o id do user"
        });
    }
    else if (req.dataUser.id_user != fk_user) {
        return res.sendStatus(403);
    }
    conn.query("INSERT INTO tbl_faturas (descricao, montante, data, fk_tipo_pagamento, fk_user) VALUES (?, ?, ?, ?, ?)", [descricao, montante, data, fk_tipo_pagamento, fk_user], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        return res.status(200).send({
            status: 1,
            message: "Fatura inserida"
        });
    });
});
router.get("/tipo-contacto/:id", authToken_1.default, checkRole_1.default.checkId, function (req, res) {
    conn.query("SELECT descricao, FROM tbl_faturas WHERE id_tipo_pagamento = ? LIMIT 1", [req.params.id], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        return res.status(200).send({
            status: 1,
            message: result[0].descricao
        });
    });
});
module.exports = router;

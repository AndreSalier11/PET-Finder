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
router.get("/:id", authToken_1.default, checkRole_1.default.checkId, function (req, res) {
    conn.query("SELECT contacto, fk_tipoContacto, fk_user WHERE id_contacto = ? LIMIT 1", [req.params.id], function (err, result) {
        if (err) {
            console.log("GET - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
            return res.sendStatus(500);
        }
        console.log("GET - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 200");
        res.status(200).json(result[0]);
    });
});
router.post("/", authToken_1.default, function (req, res) {
    const contacto = req.body.contacto;
    const fk_tipoContacto = req.body.fk_tipoContacto;
    const fk_user = req.body.fk_user;
    if (!contacto) {
        console.log("POST - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 2");
        return res.status(200).send({
            status: 2,
            message: "Tem de inserir a descricao"
        });
    }
    else if (!fk_tipoContacto) {
        console.log("POST - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 3");
        return res.status(200).send({
            status: 3,
            message: "Tem de inserir o montante"
        });
    }
    else if (!fk_user) {
        console.log("POST - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 4");
        return res.status(200).send({
            status: 4,
            message: "Tem de inserir a data"
        });
    }
    else if (req.dataUser.id_user != fk_user) {
        console.log("POST - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 403");
        return res.sendStatus(403);
    }
    conn.query("INSERT INTO tbl_contacto (contacto, fk_tipoContacto, fk_user) VALUES (?, ?, ?)", [contacto, fk_tipoContacto, fk_user], function (err, result) {
        if (err) {
            console.log("POST - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
            return res.sendStatus(500);
        }
        console.log("POST - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
        return res.status(200).send({
            status: 1,
            message: "Contacto inserido"
        });
    });
});
router.put("/:id", authToken_1.default, checkRole_1.default.checkId, function (req, res) {
    const contacto = req.body.contacto;
    const fk_tipoContacto = req.body.fk_tipoContacto;
    const fk_user = req.body.fk_user;
    if (!contacto) {
        console.log("PUT - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 5");
        return res.status(200).send({
            status: 5,
            message: "Tem de inserir a descricao"
        });
    }
    else if (!fk_tipoContacto) {
        console.log("PUT - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 6");
        return res.status(200).send({
            status: 6,
            message: "Tem de inserir o montante"
        });
    }
    else if (!fk_user) {
        console.log("PUT - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 7");
        return res.status(200).send({
            status: 7,
            message: "Tem de inserir a data"
        });
    }
    else if (req.dataUser.id_user != fk_user) {
        console.log("PUT - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 403");
        return res.sendStatus(403);
    }
    conn.query("UPDATE tbl_contacto SET contacto = ?, fk_tipoContacto = ?, fk_user = ? WHERE id_contacto = ?", [contacto, fk_tipoContacto, fk_user, req.params.id], function (err, result) {
        if (err) {
            console.log("PUT - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
            return res.sendStatus(500);
        }
        console.log("PUT - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
        return res.status(200).send({
            status: 1,
            message: "Contacto alterado"
        });
    });
});
router.delete("/:id", authToken_1.default, checkRole_1.default.checkId, function (req, res) {
    conn.query("DELETE tbl_contacto WHERE id_contacto = ?", [req.params.id], function (err, result) {
        if (err) {
            console.log("DELETE - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
            return res.sendStatus(500);
        }
        console.log("DELETE - contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
        return res.status(200).send({
            status: 1,
            message: "Contacto apagado"
        });
    });
});
router.get("/tipo-contacto/:id", authToken_1.default, checkRole_1.default.checkId, function (req, res) {
    conn.query("SELECT tipo WHERE id_tipoContacto = ? LIMIT 1", [req.params.id], function (err, result) {
        if (err) {
            console.log("GET - tipo-contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 500");
            return res.sendStatus(500);
        }
        console.log("GET - tipo-contacto " + req.params.id + " - " + req.dataUser.id_user + " " + req.dataUser.nome + " - 1");
        return res.status(200).send({
            status: 1,
            message: result[0].tipo
        });
    });
});
module.exports = router;

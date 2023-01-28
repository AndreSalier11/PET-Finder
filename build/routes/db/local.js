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
    conn.query("SELECT morada, latitude, longitude, raio FROM tbl_local WHERE id_local = ? LIMIT 1", [req.params.id], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        res.status(200).json(result[0]);
    });
});
router.post("/", authToken_1.default, checkRole_1.default.checkUserLocal, function (req, res) {
    const morada = req.body.morada;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const raio = req.body.raio;
    if (!latitude) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir a latitude"
        });
    }
    else if (!latitude.match(regex.validCoordinate)) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir uma latitude valida"
        });
    }
    else if (!longitude) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir a longitude"
        });
    }
    else if (!longitude.match(regex.validCoordinate)) {
        return res.status(200).send({
            status: 0,
            message: "Tem de inserir uma longitude valida"
        });
    }
    conn.query("INSERT INTO tbl_local (morada, latitude, longitude, raio) VALUES (?, ?, ?, ?)", [morada, latitude, longitude, raio], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        return res.status(200).send({
            status: 1,
            message: "Local inserido"
        });
    });
});
router.put("/:id", authToken_1.default, checkRole_1.default.checkId, checkRole_1.default.checkUserLocal, function (req, res) {
    conn.query("SELECT morada, latitude, longitude, raio FROM tbl_local WHERE id_local = ? LIMIT 1", [req.params.id], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        let morada = req.body.morada ? req.body.morada : result[0].morada;
        let latitude = req.body.latitude ? req.body.latitude : result[0].latitude;
        let longitude = req.body.longitude ? req.body.longitude : result[0].longitude;
        let raio = req.body.raio ? req.body.raio : result[0].raio;
        conn.query("UPDATE tbl_local SET morada = ?, latitude = ?, longitude = ?, raio = ? WHERE id_local = ?", [morada, latitude, longitude, raio, req.params.id], function (err, result) {
            if (err) {
                return res.sendStatus(500);
            }
            return res.status(200).send({
                status: 1,
                message: "Local inserido"
            });
        });
    });
});
router.delete(":id", authToken_1.default, checkRole_1.default.checkId, checkRole_1.default.checkUserLocal, function (req, res) {
    conn.query("DELETE FROM tbl_local WHERE id_local = ?", [req.params.id], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        return res.status(200).send({
            status: 1,
            message: "Local apagado"
        });
    });
});
module.exports = router;

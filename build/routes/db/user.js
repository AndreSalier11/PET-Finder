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
const validIdRegex = /^[0-9]*$/;
function checkId(id, res) {
    if (!id.match(validIdRegex)) {
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
            res.status(200).send("Não foi econtrado um User com esse id");
        }
        res.status(200).json(result[0]);
    });
});
router.put("/:id", authToken_1.default, checkRole_1.default.checkUser, function (req, res) {
    checkId(req.params.id, res);
    res.send("PUT USSSEREERERERER");
});
module.exports = router;

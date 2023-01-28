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
    conn.query("SELECT descricao FROM tbl_estado WHERE id_estado = ? LIMIT 1", [req.params.id], function (err, result) {
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

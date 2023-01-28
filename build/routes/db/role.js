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
router.get("/:id", authToken_1.default, checkRole_1.default.checkUser, checkRole_1.default.checkId, function (req, res) {
    conn.query("SELECT fk_role FROM tbl_user WHERE id_user = ? LIMIT 1", [req.params.id], function (err, result) {
        if (err) {
            return res.sendStatus(500);
        }
        conn.query("SELECT role FROM tbl_roles WHERE id_roles = ? LIMIT 1", [result[0].fk_role], function (err, result) {
            if (err) {
                return res.sendStatus(500);
            }
            return res.status(200).send({
                status: 1,
                message: result[0].role
            });
        });
    });
});
module.exports = router;

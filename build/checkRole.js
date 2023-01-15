"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const conn = require("./db_conn");
exports.default = {
    checkAdmin: function checkAdmin(req, res, next) {
        // const authHeader = req.headers["authorization"];
        // const token = authHeader && authHeader.split(" ")[1];
        // if (token == null) return res.sendStatus(401);
        const user = req.dataUser;
        // jwt.verify(token, config.SECRETKEY, (err: any, user: any) => {
        if (!user)
            return res.sendStatus(403);
        conn.query("SELECT fk_id_role FROM tbl_user WHERE email = ? LIMIT 1", [user.email], function (err, result) {
            if (err) {
                return res.status(500).send({
                    status: 0,
                    message: "Internal server error",
                });
            }
            if (result[0].fk_id_role != 2)
                return res.sendStatus(403);
        });
        next();
        //});
    },
    checkUser: function checkUser(req, res, next) {
        // const authHeader = req.headers["authorization"];
        // const token = authHeader && authHeader.split(" ")[1];
        // if (token == null) return res.sendStatus(401);
        // jwt.verify(token, config.SECRETKEY, async (err: any, user: any) => {
        const user = req.dataUser;
        if (!user)
            return res.sendStatus(403);
        new Promise(function (resolve, reject) {
            conn.query("SELECT id_user, fk_id_role FROM tbl_user WHERE email = ? LIMIT 1", [user.email], function (err, result) {
                if (err) {
                    reject();
                }
                if (result[0].id_user == req.params.id ||
                    result[0].fk_id_role == 2) {
                    resolve(1);
                }
                resolve(2);
            });
        })
            .then((nr) => {
            if (nr == 1) {
                return next();
            }
            return res.sendStatus(403);
        })
            .catch(() => {
            return res.status(500).send({
                status: 0,
                message: "Internal server error",
            });
        });
        // });
    },
};

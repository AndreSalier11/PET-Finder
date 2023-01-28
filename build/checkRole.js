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
Object.defineProperty(exports, "__esModule", { value: true });
const conn = require("./db_conn");
const regex = require("./routes/regexConfig");
exports.default = {
    checkAdmin: function checkAdmin(req, res, next) {
        const user = req.dataUser;
        if (!user)
            return res.sendStatus(403);
        conn.query("SELECT fk_role FROM tbl_user WHERE email = ? LIMIT 1", [user.email], function (err, result) {
            if (err) {
                return res.sendStatus(500);
            }
            if (result[0].fk_role != 2)
                return res.sendStatus(403);
        });
        next();
    },
    checkUser: function checkUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.dataUser;
            if (!user)
                return res.sendStatus(403);
            yield new Promise(function (resolve, reject) {
                conn.query("SELECT fk_role FROM tbl_user WHERE id_user = ? LIMIT 1", [user.id_user], function (err, result) {
                    if (err) {
                        reject();
                    }
                    if (user.id_user == req.params.id || result[0].fk_role == 2) {
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
                return res.sendStatus(500);
            });
        });
    },
    checkId: function checkId(req, res, next) {
        if (!req.params.id.match(regex.validIdRegex)) {
            return res.status(200).send({
                status: 0,
                message: "Insira um Id Válido",
            });
        }
        next();
    },
    checkUserLocal: function checkUserLocal(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.dataUser;
            if (!user)
                return res.sendStatus(403);
            yield new Promise(function (resolve, reject) {
                conn.query("SELECT fk_role FROM tbl_user WHERE id_user = ? LIMIT 1", [user.id_user], function (err, result) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            reject();
                        }
                        let result2;
                        yield new Promise(function (resolve, reject) {
                            conn.query("SELECT fk_morada FROM tbl_user WHERE id_user = ? LIMIT 1", [user.id_user], function (err, resultLocal) {
                                if (err) {
                                    reject();
                                }
                                resolve(resultLocal[0].fk_morada);
                            });
                        }).then((resultLocal) => {
                            result2 = resultLocal;
                        }).catch(() => {
                            return res.sendStatus(500);
                        });
                        if (result2 == req.params.id || result[0].fk_role == 2) {
                            resolve(1);
                        }
                        resolve(2);
                    });
                });
            })
                .then((nr) => {
                if (nr == 1) {
                    return next();
                }
                return res.sendStatus(403);
            })
                .catch(() => {
                return res.sendStatus(500);
            });
        });
    },
};

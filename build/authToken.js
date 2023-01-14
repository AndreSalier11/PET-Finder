"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const config_1 = __importDefault(require("./config"));
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, config_1.default.SECRETKEY, (err, user) => {
        if (err)
            return res.sendStatus(403);
        console.log(user);
        //req.user = user
        next();
    });
}
exports.default = authenticateToken;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const db_routes = require("./database/routes/routes");
const PORT = process.env.PORT;
const HOST = process.env.HOST;
let db_app = (0, express_1.default)();
db_app.use("", db_routes);
db_app.listen(PORT, function () {
    console.log("🐶 Base de Dados online! - A ouvir http://" + HOST + ":" + PORT);
});

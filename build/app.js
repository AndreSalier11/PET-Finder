"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const PORT = config_1.default.PORT;
const HOST = config_1.default.HOST;
let app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
// =============== ROUTES ===============
const animal = require("./routes/animal");
const contacto = require("./routes/contacto");
const especie = require("./routes/especie");
const estado = require("./routes/estado");
const fatura = require("./routes/fatura");
const favorito = require("./routes/favorito");
const local = require("./routes/local");
const role = require("./routes/role");
const user = require("./routes/user");
const login = require("./routes/login");
const db = require("./db_conn");
db.connect(function (err) {
    if (err)
        return console.log("\n🚩 error: " + err.message);
    console.log("🐶 Ligado à DB");
});
app.listen(PORT, function () {
    console.log("🐶 PetFinder API online - A ouvir http://" + HOST + ":" + PORT);
});

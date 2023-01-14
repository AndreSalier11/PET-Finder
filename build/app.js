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
// const animal = require("./routes/animal");
// const contacto = require("./routes/contacto");
// const especie = require("./routes/especie");
// const estado = require("./routes/estado");
// const fatura = require("./routes/fatura");
// const favorito = require("./routes/favorito");
// const local = require("./routes/local");
// const role = require("./routes/role");
// const user = require("./routes/user");
const login = require("./routes/login");
// app.use("/animal", animal);
// app.use("/contacto", contacto);
// app.use("/especie", especie);
// app.use("/estado", estado);
// app.use("/fatura", fatura);
// app.use("/favorito", favorito);
// app.use("/local", local);
// app.use("/role", role);
// app.use("/user", user);
app.use("/login", login);
// ======================================
app.listen(PORT, function () {
    console.log("🐶 PetFinder API online - A ouvir http://" + HOST + ":" + PORT);
});

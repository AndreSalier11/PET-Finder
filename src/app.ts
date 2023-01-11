import express, {Application} from "express";
import config from "./typings/config";

const PORT = config.PORT;
const HOST = config.HOST;

let app: Application = express();

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

app.use("/animal", animal);
app.use("/contacto", contacto);
app.use("/especie", especie);
app.use("/estado", estado);
app.use("/fatura", fatura);
app.use("/favorito", favorito);
app.use("/local", local);
app.use("/role", role);
app.use("/user", user);
// ======================================


app.listen(PORT, function () {
  console.log("🐶 API DB online - A ouvir http://" + HOST + ":" + PORT);
});
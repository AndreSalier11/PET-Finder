import express, { Application } from "express";
import config from "./config";

const PORT = config.PORT;
const HOST = config.HOST;

let app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// =============== ROUTES ===============
// const animal = require("./routes/db/animal");
// const contacto = require("./routes/db/contacto");
// const especie = require("./routes/db/especie");
// const estado = require("./routes/db/estado");
// const fatura = require("./routes/db/fatura");
// const favorito = require("./routes/db/favorito");
// const local = require("./routes/db/local");
const role = require("./routes/db/role");
const user = require("./routes/db//user");

const login = require("./routes/auth/login");
const signup = require("./routes/auth/signup");

// app.use("/animal", animal);
// app.use("/contacto", contacto);
// app.use("/especie", especie);
// app.use("/estado", estado);
// app.use("/fatura", fatura);
// app.use("/favorito", favorito);
// app.use("/local", local);
app.use("/role", role);
app.use("/user", user);

app.use("/login", login);
app.use("/signup", signup);
// ======================================

app.listen(PORT, function () {
  console.log("🐶 PetFinder API online - A ouvir http://" + HOST + ":" + PORT);
});

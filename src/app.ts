import express, { Application } from "express";
import config from "./config";
const bodyParser = require("body-parser");

const PORT = config.PORT;
const HOST = config.HOST;

let app: Application = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// =============== ROUTES ===============
const animal = require("./routes/db/animal");
const contacto = require("./routes/db/contacto");
const especie = require("./routes/db/especie");
const estado = require("./routes/db/estado");
const fatura = require("./routes/db/fatura");
const favorito = require("./routes/db/favorito");
const local = require("./routes/db/local");
const role = require("./routes/db/role");
const user = require("./routes/db/user");

const checktoken = require("./routes/auth/checkToken");
const login = require("./routes/auth/login");
const signup = require("./routes/auth/signup");

const getFile = require("./routes/getFile");

app.use("/animal", animal);
app.use("/contacto", contacto);
app.use("/especie", especie);
app.use("/estado", estado);
app.use("/fatura", fatura);
app.use("/favorito", favorito);
app.use("/local", local);
app.use("/role", role);
app.use("/user", user);

app.use("/checktoken", checktoken)
app.use("/login", login);
app.use("/signup", signup);

app.use("/data", getFile);
// ======================================

// app.use(function(req, res){
//   res.sendStatus(404);
// });

app.listen(PORT, function () {
  console.log("🐶 PetFinder API online - A ouvir http://" + HOST + ":" + PORT);
});

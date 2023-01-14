import express, { Application } from "express";
import config from "./config";

const PORT = config.PORT;
const HOST = config.HOST;

let app: Application = express();
app.use(express.urlencoded({extended:true}))

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

// app.use("/animal", animal);
// app.use("/contacto", contacto);
// app.use("/especie", especie);
// app.use("/estado", estado);
// app.use("/fatura", fatura);
// app.use("/favorito", favorito);
// app.use("/local", local);
// app.use("/role", role);
// app.use("/user", user);

// app.use("/login", login);
// ======================================
import { Connection } from "mysql";
const db: Connection = require("./db_conn");

db.connect(function (err: any) {
  if (err) return console.log("\n🚩 error: " + err.message);
  console.log("🐶 Ligado à DB");
});


app.listen(PORT, function () {
  console.log("🐶 PetFinder API online - A ouvir http://" + HOST + ":" + PORT);
});

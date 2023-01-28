"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authToken_1 = __importDefault(require("../authToken"));
const router = express_1.default.Router();
router.get("/user_img", authToken_1.default, function (req, res) {
    const img = req.body.img;
    if (req.body.img) {
        res.status(200).sendFile("/user_img/" + img, function (err) {
            res.status(404).send({
                status: 0,
                message: "A imagem pela qual procura não se encontra disponivel",
            });
        });
    }
    else {
        res.status(200).send({
            status: 0,
            message: "Qual é a imagem que precisa?",
        });
    }
});
router.get("/animal_img", authToken_1.default, function (req, res) {
    const img = req.body.img;
    if (req.body.img) {
        res.status(200).sendFile("/animal_img/" + img, function (err) {
            res.status(404).send({
                status: 0,
                message: "A imagem pela qual procura não se encontra disponivel",
            });
        });
    }
    else {
        res.status(200).send({
            status: 0,
            message: "Qual é a imagem que precisa?",
        });
    }
});
module.exports = router;

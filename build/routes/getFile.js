"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authToken_1 = __importDefault(require("../authToken"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
router.get("/user_img", authToken_1.default, function (req, res) {
    const img = req.body.img;
    var options = {
        root: path_1.default.join(__dirname + "/../../data/user_img/")
    };
    if (req.body.img) {
        res.status(200).sendFile(img, options, function (err) {
            if (err) {
                return res.status(404).send({
                    status: 2,
                    message: "A imagem pela qual procura não se encontra disponivel",
                });
            }
        });
    }
    else {
        res.status(200).send({
            status: 3,
            message: "Qual é a imagem que precisa?",
        });
    }
});
router.get("/animal_img", authToken_1.default, function (req, res) {
    const img = req.body.img;
    var options = {
        root: path_1.default.join(__dirname + "/../../data/animal_img/")
    };
    if (req.body.img) {
        res.status(200).sendFile(img, options, function (err) {
            if (err) {
                return res.status(404).send({
                    status: 2,
                    message: "A imagem pela qual procura não se encontra disponivel",
                });
            }
        });
    }
    else {
        res.status(200).send({
            status: 3,
            message: "Qual é a imagem que precisa?",
        });
    }
});
module.exports = router;

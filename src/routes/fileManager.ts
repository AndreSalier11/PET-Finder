import path from "path";
import config from "../config";
const multer = require('multer');

const fileTypes = ["png", "jpg", "jpeg", "webp"];

const multerStorage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: any) {
    cb(null, path.join(config.DIR, "/data/user_img"));
  },

  filename: function(req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const name = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split(".")[1];
    cb(null, name);
  }
});

const multerFilter = function(req: any, file: any, cb: any, res: any) {
  if(fileTypes.includes(file.originalname.split(".")[1])) {
    cb(null, true);
  } else {
    req.fileValidationError = "O arquivo tem de ser uma imagem"
    cb(null, false);
  }
}

const multerLimit = {
  fields: 100,
  fileSize: 20971520,
  files: 100,
  parts: 100
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: multerLimit
});

module.exports.file = upload;
module.exports.fileTypes = fileTypes;
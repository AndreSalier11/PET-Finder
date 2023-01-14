import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
import config from "./config";

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.SECRETKEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    console.log(user);

    next()
  })
}

export default authenticateToken;
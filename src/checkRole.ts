import { NextFunction, Request, Response } from "express";
import { Connection } from "mysql";
const conn: Connection = require("./db_conn");
const regex = require("../regexConfig");

export default {
  checkAdmin: function checkAdmin(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const user: any = req.dataUser;

    if (!user) return res.sendStatus(403);

    conn.query(
      "SELECT fk_id_role FROM tbl_user WHERE email = ? LIMIT 1",
      [user.email],
      function (err, result) {
        if (err) {
          return res.sendStatus(500);
        }

        if (result[0].fk_id_role != 2) return res.sendStatus(403);
      }
    );

    next();
  },

  checkUser: async function checkUser(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const user: any = req.dataUser;

    if (!user) return res.sendStatus(403);

    await new Promise(function (resolve, reject) {
      conn.query(
        "SELECT fk_id_role FROM tbl_user WHERE id_user = ? LIMIT 1",
        [user.id_user],
        function (err, result) {
          if (err) {
            reject();
          }
          
          if (user.id_user == req.params.id || result[0].fk_id_role == 2) {
            resolve(1);
          }
          resolve(2);
        }
      );
    })
      .then((nr) => {
        if (nr == 1) {
          return next();
        }
        return res.sendStatus(403);
      })
      .catch(() => {
        return res.sendStatus(500);
      });
  },

  checkId: function checkId(req: any, res: any, next: any) {
    if (!req.params.id.match(regex.validIdRegex)) {
      return res.status(200).send({
        status: 0,
        message: "Insira um Id Válido",
      });
    }
    next();
  },

  checkUserLocal: async function checkUserLocal(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const user: any = req.dataUser;

    if (!user) return res.sendStatus(403);

    await new Promise(function (resolve, reject) {
      conn.query(
        "SELECT fk_id_role FROM tbl_user WHERE id_user = ? LIMIT 1",
        [user.id_user],
        async function (err, result) {
          if (err) {
            reject();
          }

          let result2;

          await new Promise<void>(function (resolve, reject) {
            conn.query(
              "SELECT fk_morada FROM tbl_user WHERE id_user = ? LIMIT 1",
              [user.id_user],
              function (err, resultLocal) {
                if (err) {
                  reject();
                }
                
                resolve(resultLocal[0].fk_morada);
            })
          }).then((resultLocal) => {
            result2 = resultLocal;
          }).catch(() => {
            return res.sendStatus(500);
          })
          
          if (result2 == req.params.id || result[0].fk_id_role == 2) {
            resolve(1);
          }
          resolve(2);
        }
      );
    })
      .then((nr) => {
        if (nr == 1) {
          return next();
        }
        return res.sendStatus(403);
      })
      .catch(() => {
        return res.sendStatus(500);
      });
  },
};

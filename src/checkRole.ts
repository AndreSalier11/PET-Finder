import { NextFunction, Request, Response } from "express";
import { Connection } from "mysql";
const conn: Connection = require("./db_conn");

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
          return res.status(500).send({
            status: 0,
            message: "Internal server error",
          });
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
        "SELECT id_user, fk_id_role FROM tbl_user WHERE email = ? LIMIT 1",
        [user.email],
        function (err, result) {
          if (err) {
            reject();
          }

          if (result[0].id_user == req.params.id || result[0].fk_id_role == 2) {
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
        return res.status(500).send({
          status: 0,
          message: "Internal server error",
        });
      });
  },
};

import {Request, Response} from "express";
import db from "../database/prisma.connection";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

class AuthController {
  public async create(req: Request, res: Response) {
    const {email, password, username} = req.body;

    try {
      if ((!email && !password) || (!username && !password)) {
        return res.status(400).json({success: false, msg: "Preencha todos os campos."});
      }

      const findUser = await db.users.findUnique({
        where: {email, username},
      });

      if (!findUser || !bcrypt.compareSync(password, findUser.password || "")) {
        return res.status(401).json({success: false, msg: "Email ou senha incorretos."});
      }

      const token = uuid();

      await db.users.update({
        where: {id: findUser?.id},
        data: {token},
      });

      res.status(200).json({success: true, msg: "Usuário logado com sucesso.", data: {token}});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }
}

export default AuthController;

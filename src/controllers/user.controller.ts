import {Request, Response} from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";

class UserController {
  public async list(req: Request, res: Response) {
    try {
      const users = await db.users.findMany();

      return res.status(200).json({success: true, msg: "Lista de usuários.", data: users});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async create(req: Request, res: Response) {
    const {name, email, username, password} = req.body;

    try {
      if (!name || !email || !username || !password) {
        return res.status(400).json({success: false, msg: "Preencha todos os campos."});
      }

      const hash = generateHash(password);

      const newUser = await db.users.create({
        data: {name, email, username, password: hash},
      });

      if (newUser) {
        return res.status(200).json({
          success: true,
          msg: "Usuário criado com sucesso.",
          data: {id: newUser.id, name: newUser.name, email: newUser.email, username: newUser.username},
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async show(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const user = await db.users.findUnique({
        where: {id},
      });

      if (user) {
        return res.status(200).json({success: true, msg: "Informações de usuário.", data: user});
      }

      return res.status(404).json({success: false, msg: "Usuário não encontrado."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async update(req: Request, res: Response) {
    const {id} = req.params;
    const {name, email, username, password} = req.body;

    try {
      const user = await db.users.findUnique({
        where: {id},
      });

      if (!user) {
        return res.status(404).json({success: false, msg: "Usuário não encontrado."});
      }

      if (!name || !email || !username || !password) {
        return res.status(400).json({success: false, msg: "Preencha todos os campos."});
      }

      const hash = generateHash(password);

      if (name && email && username && password) {
        const updatedUser = await db.users.update({
          where: {id},
          data: {name, email, username, password: hash},
        });

        return res.status(200).json({
          success: true,
          msg: "Usuário criado com sucesso.",
          data: {id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, username: updatedUser.username},
        });
      }

      return res.status(400).json({success: false, msg: "Usuário não atualizado."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async delete(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const user = await db.users.findUnique({
        where: {id},
      });

      if (user) {
        await db.users.delete({
          where: {id},
        });
        return res.status(200).json({
          success: true,
          msg: "Usuário deletado com sucesso.",
        });
      }

      return res.status(404).json({success: false, msg: "Usuário não encontrado."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }
}

export default UserController;

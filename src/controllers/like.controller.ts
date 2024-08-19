import {Request, Response} from "express";
import db from "../database/prisma.connection";

class LikeController {
  public async list(req: Request, res: Response) {
    try {
      const likes = await db.likes.findMany({
        include: {
          tweet: {
            select: {
              content: true,
            },
          },
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      if (likes.length === 0) {
        return res.status(400).json({success: false, msg: "Nenhum like encontrado"});
      }

      return res.status(200).json({success: true, msg: "Lista de likes.", data: likes});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async create(req: Request, res: Response) {
    const {userId, tweetId} = req.body;

    try {
      if (!userId || !tweetId) {
        return res.status(400).json({success: false, msg: "É necessário informar o usuário e o tweet."});
      }

      const user = await db.users.findUnique({
        where: {id: userId},
      });

      const newLike = await db.likes.create({
        data: {userId, tweetId},
      });

      if (newLike) {
        return res.status(200).json({
          success: true,
          msg: `${user?.username} curtiu.`,
          data: {id: newLike.id, userId: newLike.userId, tweetId: newLike.tweetId},
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
      const like = await db.likes.findUnique({
        where: {id},
        include: {
          tweet: {
            select: {
              content: true,
            },
          },
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      if (!like) {
        return res.status(404).json({success: false, msg: "Like não encontrado."});
      }

      return res.status(200).json({
        success: true,
        msg: "Informações do like.",
        data: like,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async delete(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const like = await db.likes.findUnique({
        where: {id},
      });

      if (like) {
        await db.likes.delete({
          where: {id},
        });
        return res.status(200).json({
          success: true,
          msg: "Tweet descurtido.",
        });
      }

      return res.status(404).json({success: false, msg: "Like não encontrado."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }
}

export default LikeController;

import {Request, Response} from "express";
import db from "../database/prisma.connection";

class FollowController {
  public async list(req: Request, res: Response) {
    try {
      const follows = await db.followers.findMany({
        select: {
          id: true,
          followerId: true,
          followingId: true,
        },
      });

      return res.status(200).json({success: true, msg: "Lista de follows.", data: follows});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async show(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const follow = await db.followers.findUnique({
        where: {id},
        select: {
          followerId: true,
          followingId: true,
        },
      });

      return res.status(200).json({success: true, msg: "Dados desta seguida.", data: follow});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async create(req: Request, res: Response) {
    const {followerId, followingId} = req.body;

    try {
      const follower = await db.users.findUnique({
        where: {id: followerId},
        select: {id: true, username: true},
      });

      const following = await db.users.findUnique({
        where: {id: followingId},
        select: {
          id: true,
          username: true,
          Following: {
            select: {
              followingId: true,
            },
          },
        },
      });

      if (!followerId || !followingId) {
        return res.status(400).json({success: false, msg: "É necessário informar o seguidor e quem será seguido."});
      }

      if (followerId === followingId) {
        return res.status(400).json({success: false, msg: "O usuário não pode seguir a si mesmo."});
      }

      const newFollower = await db.followers.create({
        data: {followerId, followingId},
      });

      if (newFollower) {
        return res.status(200).json({success: true, msg: `${follower?.username} está seguindo ${following?.username}`});
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async delete(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const follow = await db.followers.findUnique({
        where: {id},
      });

      if (follow) {
        await db.followers.delete({
          where: {id},
        });

        return res.status(200).json({
          success: true,
          msg: "Seguida desfeita.",
        });
      }

      return res.status(404).json({success: false, msg: "Não há essa seguida."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }
}

export default FollowController;

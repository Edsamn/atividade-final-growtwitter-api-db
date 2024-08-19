import {Request, Response} from "express";
import db from "../database/prisma.connection";

class FollowController {
  public async list(req: Request, res: Response) {
    const {userId} = req.params;

    try {
      const followers = await db.users.findUnique({
        where: {id: userId},
        select: {
          Followers: {
            include: {
              follower: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      const following = await db.users.findUnique({
        where: {id: userId},
        select: {
          Following: {
            include: {
              following: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      if (!followers) {
        return res.status(400).json({success: false, msg: "Você não possui seguidores."});
      }

      if (!following) {
        return res.status(400).json({success: false, msg: "Você não segue ninguém."});
      }

      return res.status(200).json({success: true, msg: "Lista de seguidores e seguidos.", data: followers, following});
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
      });

      const following = await db.users.findUnique({
        where: {id: followingId},
      });
      if (!followerId || !followingId) {
        return res.status(400).json({success: false, msg: "É necessário informar o usuário e quem será seguido."});
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

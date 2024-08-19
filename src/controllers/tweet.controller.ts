import {Request, Response} from "express";
import db from "../database/prisma.connection";

class TweetController {
  public async list(req: Request, res: Response) {
    try {
      const tweets = await db.tweets.findMany();

      if (tweets.length === 0) {
        return res.status(400).json({success: false, msg: "Nenhum tweet encontrado"});
      }

      return res.status(200).json({success: true, msg: "Lista de tweets.", data: tweets});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async create(req: Request, res: Response) {
    const {content, userId} = req.body;

    try {
      if (!content || !userId) {
        return res.status(400).json({success: false, msg: "Preencha todos os campos."});
      }

      const newTweet = await db.tweets.create({
        data: {content, userId},
      });

      if (newTweet) {
        return res.status(200).json({
          success: true,
          msg: "Tweet enviado com sucesso.",
          data: {id: newTweet.id, content: newTweet.content},
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
      const tweet = await db.tweets.findUnique({
        where: {id},
        include: {
          user: {
            select: {id: true, name: true, username: true},
          },
        },
      });

      if (tweet) {
        return res.status(200).json({
          success: true,
          msg: "Informações do tweet.",
          data: tweet,
        });
      }

      return res.status(404).json({success: false, msg: "Tweet não encontrado."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async update(req: Request, res: Response) {
    const {id} = req.params;
    const {content} = req.body;

    try {
      const tweet = await db.tweets.findUnique({
        where: {id},
      });

      if (!tweet) {
        return res.status(404).json({success: false, msg: "Tweet não encontrado."});
      }

      if (!content) {
        return res.status(400).json({success: false, msg: "O conteúdo não pode ficar em branco."});
      }

      if (content) {
        const updatedTweet = await db.tweets.update({
          where: {id},
          data: {content},
        });

        if (updatedTweet) {
          return res.status(200).json({
            success: true,
            msg: "Tweet atualizado com sucesso.",
            data: {
              id: updatedTweet.id,
              content: updatedTweet.content,
            },
          });
        }
      }

      return res.status(400).json({success: false, msg: "Tweet não atualizado."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async delete(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const tweet = await db.tweets.findUnique({
        where: {id},
      });

      if (tweet) {
        await db.tweets.delete({
          where: {id},
        });

        return res.status(200).json({
          success: true,
          msg: "Tweet deletado com sucesso.",
        });
      }

      return res.status(404).json({success: false, msg: "Tweet não encontrado."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }
}

export default TweetController;

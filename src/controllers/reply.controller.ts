import {Request, Response} from "express";
import db from "../database/prisma.connection";

class ReplyController {
  public async list(req: Request, res: Response) {
    try {
      const replies = await db.replies.findMany();

      if (replies.length === 0) {
        return res.status(400).json({success: false, msg: "Nenhuma resposta encontrado"});
      }

      return res.status(200).json({success: true, msg: "Lista de tweets.", data: replies});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async create(req: Request, res: Response) {
    const {content, userId, tweetId} = req.body;

    try {
      if (!content || !userId || !tweetId) {
        return res.status(400).json({success: false, msg: "Preencha todos os campos."});
      }

      const newReply = await db.replies.create({
        data: {content, userId, tweetId},
      });

      if (newReply) {
        return res.status(200).json({
          success: true,
          msg: "Tweet respondido com sucesso.",
          data: {id: newReply.id, content: newReply.content},
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
      const reply = await db.replies.findUnique({
        where: {id},
        include: {
          user: {
            select: {id: true, username: true},
          },
          tweet: {
            select: {
              content: true,
            },
          },
        },
      });

      if (reply) {
        return res.status(200).json({
          success: true,
          msg: "Informações da resposta.",
          data: reply,
        });
      }

      return res.status(404).json({success: false, msg: "Resposta não encontrado."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async update(req: Request, res: Response) {
    const {id} = req.params;
    const {content} = req.body;

    try {
      const reply = await db.replies.findUnique({
        where: {id},
      });

      if (!reply) {
        return res.status(404).json({success: false, msg: "Resposta não encontrada."});
      }

      if (!content) {
        return res.status(400).json({success: false, msg: "O conteúdo não pode ficar em branco."});
      }

      if (content) {
        const updatedReply = await db.replies.update({
          where: {id},
          data: {content},
        });

        if (updatedReply) {
          return res.status(200).json({
            success: true,
            msg: "Resposta editada.",
            data: {
              id: updatedReply.id,
              content: updatedReply.content,
            },
          });
        }
      }

      return res.status(400).json({success: false, msg: "Resposta não editada."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async delete(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const reply = await db.replies.findUnique({
        where: {id},
      });

      if (reply) {
        await db.replies.delete({
          where: {id},
        });

        return res.status(200).json({
          success: true,
          msg: "Resposta apagada com sucesso.",
        });
      }

      return res.status(404).json({success: false, msg: "Resposta não encontrada."});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }
}

export default ReplyController;

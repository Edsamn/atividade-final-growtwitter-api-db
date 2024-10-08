import {Router} from "express";
import LikeController from "../controllers/like.controller";
import authMiddleware from "../middlewares/auth.middleware";

const routes = () => {
  const router = Router();
  const controller = new LikeController();

  router.get("/", authMiddleware, controller.list);
  router.get("/:id", authMiddleware, controller.show);
  router.post("/", authMiddleware, controller.create);
  router.delete("/:id", authMiddleware, controller.delete);

  return router;
};

export default routes;

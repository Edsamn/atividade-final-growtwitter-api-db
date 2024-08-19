import {Router} from "express";
import LikeController from "../controllers/like.controller";

const routes = () => {
  const router = Router();
  const controller = new LikeController();

  router.get("/", controller.list);
  router.get("/:id", controller.show);
  router.post("/", controller.create);
  router.delete("/:id", controller.delete);

  return router;
};

export default routes;

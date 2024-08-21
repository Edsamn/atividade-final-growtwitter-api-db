import {Router} from "express";
import FollowerController from "../controllers/followers.controller";
import authMiddleware from "../middlewares/auth.middleware";

const routes = () => {
  const router = Router();
  const controller = new FollowerController();

  router.get("/", authMiddleware, controller.list);
  router.get("/:id", authMiddleware, controller.show);
  router.post("/", authMiddleware, controller.create);
  router.delete("/:id", authMiddleware, controller.delete);

  return router;
};

export default routes;

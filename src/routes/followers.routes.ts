import {Router} from "express";
import FollowerController from "../controllers/follow.controller";

const routes = () => {
  const router = Router();
  const controller = new FollowerController();

  router.get("/:userId", controller.list);
  router.post("/", controller.create);
  router.delete("/:id", controller.delete);

  return router;
};

export default routes;

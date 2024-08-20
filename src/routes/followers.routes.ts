import {Router} from "express";
import FollowerController from "../controllers/followers.controller";

const routes = () => {
  const router = Router();
  const controller = new FollowerController();

  router.get("/", controller.list);
  router.get("/:id", controller.show);
  router.post("/", controller.create);
  router.delete("/:id", controller.delete);

  return router;
};

export default routes;

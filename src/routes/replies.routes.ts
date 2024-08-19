import {Router} from "express";
import ReplyController from "../controllers/reply.controller";

const routes = () => {
  const router = Router();
  const controller = new ReplyController();

  router.get("/", controller.list);
  router.get("/:id", controller.show);
  router.put("/:id", controller.update);
  router.post("/", controller.create);
  router.delete("/:id", controller.delete);

  return router;
};

export default routes;

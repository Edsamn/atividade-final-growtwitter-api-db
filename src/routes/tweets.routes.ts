import {Router} from "express";
import TweetController from "../controllers/tweet.controller";

const routes = () => {
  const router = Router();
  const controller = new TweetController();

  router.get("/", controller.list);
  router.get("/:id", controller.show);
  router.put("/:id", controller.update);
  router.post("/", controller.create);
  router.delete("/:id", controller.delete);

  return router;
};

export default routes;

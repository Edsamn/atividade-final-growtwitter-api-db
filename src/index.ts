import * as dotenv from "dotenv";
import express from "express";
import usersRoutes from "./routes/users.routes";
import tweetsRoutes from "./routes/tweets.routes";
import likesRoutes from "./routes/likes.routes";
import repliesRoutes from "./routes/replies.routes";
import followersRoutes from "./routes/followers.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/users", usersRoutes());
app.use("/tweets", tweetsRoutes());
app.use("/likes", likesRoutes());
app.use("/replies", repliesRoutes());
app.use("/followers", followersRoutes());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}.`);
});

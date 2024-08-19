import * as dotenv from "dotenv";
import express from "express";
import usersRoutes from "./routes/users.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/users", usersRoutes());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}.`);
});

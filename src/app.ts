import express from "express";
import { userRoutes } from "./routes/user.routes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.use("/users", userRoutes);

export { app };

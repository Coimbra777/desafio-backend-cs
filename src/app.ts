import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { ticketRoutes } from "./routes/ticket.routes";
import { userRoutes } from "./routes/user.routes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.use("/tickets", ticketRoutes);
app.use("/users", userRoutes);
app.use(errorHandler);

export { app };

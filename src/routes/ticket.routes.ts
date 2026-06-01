import { Router } from "express";
import { ticketController } from "../controllers/ticket.controller";

const ticketRoutes = Router();

ticketRoutes.post("/", (request, response, next) =>
  ticketController.create(request, response, next),
);
ticketRoutes.get("/", (request, response, next) =>
  ticketController.findAll(request, response, next),
);
ticketRoutes.get("/:id", (request, response, next) =>
  ticketController.findById(request, response, next),
);
ticketRoutes.put("/:id/status", (request, response, next) =>
  ticketController.updateStatus(request, response, next),
);

export { ticketRoutes };

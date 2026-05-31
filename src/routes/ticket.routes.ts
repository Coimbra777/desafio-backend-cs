import { Router } from "express";
import { ticketController } from "../controllers/ticket.controller";

const ticketRoutes = Router();

ticketRoutes.post("/", (request, response) => ticketController.create(request, response));
ticketRoutes.get("/", (request, response) => ticketController.findAll(request, response));
ticketRoutes.get("/:id", (request, response) => ticketController.findById(request, response));
ticketRoutes.put("/:id/status", (request, response) =>
  ticketController.updateStatus(request, response),
);

export { ticketRoutes };

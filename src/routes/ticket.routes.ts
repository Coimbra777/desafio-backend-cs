import { Router } from "express";
import { ticketController } from "../controllers/ticket.controller";

const ticketRoutes = Router();

ticketRoutes.post("/", (request, response) => ticketController.create(request, response));

export { ticketRoutes };

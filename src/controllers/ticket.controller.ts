import { Request, Response } from "express";
import { AppError, ticketService } from "../services/ticket.service";

class TicketController {
  async create(request: Request, response: Response) {
    try {
      const ticket = await ticketService.create(request.body);

      return response.status(201).json(ticket);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  private handleError(error: unknown, response: Response) {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return response.status(500).json({
      message: "Internal server error.",
    });
  }
}

const ticketController = new TicketController();

export { ticketController };

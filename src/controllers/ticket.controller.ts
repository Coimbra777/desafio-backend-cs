import { Request, Response } from "express";
import { AppError, ticketService } from "../services/ticket.service";

type TicketParams = {
  id: string;
};

class TicketController {
  async create(request: Request, response: Response) {
    try {
      const ticket = await ticketService.create(request.body);

      return response.status(201).json(ticket);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async findAll(_request: Request, response: Response) {
    try {
      const tickets = await ticketService.findAll();

      return response.status(200).json(tickets);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async findById(request: Request<TicketParams>, response: Response) {
    try {
      const ticket = await ticketService.findById(request.params.id);

      return response.status(200).json(ticket);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async updateStatus(request: Request<TicketParams>, response: Response) {
    try {
      const ticket = await ticketService.updateStatus(request.params.id, request.body);

      return response.status(200).json(ticket);
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

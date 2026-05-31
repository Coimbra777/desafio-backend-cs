import { NextFunction, Request, Response } from "express";
import { ticketService } from "../services/ticket.service";

type TicketParams = {
  id: string;
};

class TicketController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const ticket = await ticketService.create(request.body);

      return response.status(201).json(ticket);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(_request: Request, response: Response, next: NextFunction) {
    try {
      const tickets = await ticketService.findAll();

      return response.status(200).json(tickets);
    } catch (error) {
      return next(error);
    }
  }

  async findById(
    request: Request<TicketParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const ticket = await ticketService.findById(Number(request.params.id));

      return response.status(200).json(ticket);
    } catch (error) {
      return next(error);
    }
  }

  async updateStatus(
    request: Request<TicketParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const ticket = await ticketService.updateStatus(
        Number(request.params.id),
        request.body,
      );

      return response.status(200).json(ticket);
    } catch (error) {
      return next(error);
    }
  }
}

const ticketController = new TicketController();

export { ticketController };

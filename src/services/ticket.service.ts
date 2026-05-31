import { userRepository } from "../repositories/user.repository";
import { ticketRepository } from "../repositories/ticket.repository";
import { classifyTicket } from "../utils/classify-ticket";

type CreateTicketInput = {
  description?: string;
  userId?: string;
};

type UpdateTicketStatusInput = {
  status?: string;
};

const allowedTicketStatus = ["open", "in_progress", "closed"];

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class TicketService {
  async create(data: CreateTicketInput) {
    if (!data.description || !data.description.trim()) {
      throw new AppError("Description is required.", 400);
    }

    if (data.userId) {
      const user = await userRepository.findById(data.userId);

      if (!user) {
        throw new AppError("User not found.", 404);
      }
    }

    const { channel, priority } = classifyTicket(data.description);

    return ticketRepository.create({
      description: data.description.trim(),
      channel,
      priority,
      status: "open",
      userId: data.userId,
    });
  }

  async findAll() {
    return ticketRepository.findAll();
  }

  async findById(id: string) {
    const ticket = await ticketRepository.findById(id);

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    return ticket;
  }

  async updateStatus(id: string, data: UpdateTicketStatusInput) {
    if (!data.status) {
      throw new AppError("Status is required", 400);
    }

    if (!allowedTicketStatus.includes(data.status)) {
      throw new AppError("Invalid status", 400);
    }

    const ticket = await ticketRepository.findById(id);

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    return ticketRepository.updateStatus(id, {
      status: data.status,
    });
  }
}

const ticketService = new TicketService();

export { AppError, ticketService };

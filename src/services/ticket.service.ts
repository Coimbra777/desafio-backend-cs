import { TICKET_STATUSES, type TicketStatus } from "../constants/ticket";
import { AppError } from "../errors/AppError";
import { userRepository } from "../repositories/user.repository";
import { ticketRepository } from "../repositories/ticket.repository";
import { classifyTicket } from "../utils/classify-ticket";
import { isValidId } from "../utils/is-valid-id";
import { normalizeOptionalString } from "../utils/input-validation";

type CreateTicketInput = {
  description?: string;
  userId?: number | string;
};

type UpdateTicketStatusInput = {
  status?: string;
};

class TicketService {
  async create(data: CreateTicketInput) {
    const description = normalizeOptionalString(data.description);

    if (!description) {
      throw new AppError("Description is required");
    }

    let userId: number | undefined;

    if (data.userId !== undefined && data.userId !== null) {
      userId = Number(data.userId);

      if (!isValidId(userId)) {
        throw new AppError("Invalid user id");
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }
    }

    const { channel, priority, requiresManualReview } = classifyTicket(description);

    return ticketRepository.create({
      description,
      channel,
      priority,
      status: "open",
      requiresManualReview,
      userId,
    });
  }

  async findAll() {
    return ticketRepository.findAll();
  }

  async findById(id: number) {
    if (!isValidId(id)) {
      throw new AppError("Invalid ticket id");
    }

    const ticket = await ticketRepository.findById(id);

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    return ticket;
  }

  async updateStatus(id: number, data: UpdateTicketStatusInput) {
    if (!isValidId(id)) {
      throw new AppError("Invalid ticket id");
    }

    const status = normalizeOptionalString(data.status);

    if (!status) {
      throw new AppError("Status is required");
    }

    if (!TICKET_STATUSES.includes(status as TicketStatus)) {
      throw new AppError("Invalid status");
    }

    const ticket = await ticketRepository.findById(id);

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    return ticketRepository.updateStatus(id, {
      status: status as TicketStatus,
    });
  }
}

const ticketService = new TicketService();

export { ticketService };

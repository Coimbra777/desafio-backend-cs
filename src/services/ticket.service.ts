import { AppError } from "../errors/AppError";
import { userRepository } from "../repositories/user.repository";
import { ticketRepository } from "../repositories/ticket.repository";
import { classifyTicket } from "../utils/classify-ticket";

type CreateTicketInput = {
  description?: string;
  userId?: number | string;
};

type UpdateTicketStatusInput = {
  status?: string;
};

type UpdateTicketInput = {
  description?: string;
  userId?: number | string;
};

const allowedTicketStatus = ["open", "in_progress", "closed"];

class TicketService {
  async create(data: CreateTicketInput) {
    if (!data.description || !data.description.trim()) {
      throw new AppError("Description is required");
    }

    let userId: number | undefined;

    if (data.userId) {
      userId = Number(data.userId);

      if (Number.isNaN(userId)) {
        throw new AppError("Invalid user id");
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }
    }

    const { channel, priority } = classifyTicket(data.description);

    return ticketRepository.create({
      description: data.description.trim(),
      channel,
      priority,
      status: "open",
      userId,
    });
  }

  async findAll() {
    return ticketRepository.findAll();
  }

  async findById(id: number) {
    if (Number.isNaN(id)) {
      throw new AppError("Invalid ticket id");
    }

    const ticket = await ticketRepository.findById(id);

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    return ticket;
  }

  async updateStatus(id: number, data: UpdateTicketStatusInput) {
    if (Number.isNaN(id)) {
      throw new AppError("Invalid ticket id");
    }

    if (!data.status) {
      throw new AppError("Status is required");
    }

    if (!allowedTicketStatus.includes(data.status)) {
      throw new AppError("Invalid status");
    }

    const ticket = await ticketRepository.findById(id);

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    return ticketRepository.updateStatus(id, {
      status: data.status,
    });
  }

  async update(id: number, data: UpdateTicketInput) {
    if (Number.isNaN(id)) {
      throw new AppError("Invalid ticket id");
    }

    const ticket = await ticketRepository.findById(id);

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    const updateData: {
      description?: string;
      channel?: string;
      priority?: string;
      userId?: number;
    } = {};

    if (data.description !== undefined) {
      const description = data.description.trim();

      if (!description) {
        throw new AppError("Description is required");
      }

      const { channel, priority } = classifyTicket(description);

      updateData.description = description;
      updateData.channel = channel;
      updateData.priority = priority;
    }

    if (data.userId !== undefined) {
      const userId = Number(data.userId);

      if (Number.isNaN(userId)) {
        throw new AppError("Invalid user id");
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      updateData.userId = userId;
    }

    return ticketRepository.update(id, updateData);
  }

  async delete(id: number) {
    if (Number.isNaN(id)) {
      throw new AppError("Invalid ticket id");
    }

    const ticket = await ticketRepository.findById(id);

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    await ticketRepository.delete(id);
  }
}

const ticketService = new TicketService();

export { ticketService };

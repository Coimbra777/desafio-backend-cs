import type {
  TicketChannel,
  TicketPriority,
  TicketStatus,
} from "../constants/ticket";
import { prisma } from "../lib/prisma";

type CreateTicketData = {
  description: string;
  channel: TicketChannel;
  priority: TicketPriority;
  status: TicketStatus;
  requiresManualReview: boolean;
  userId?: number;
};

type UpdateTicketStatusData = {
  status: TicketStatus;
};

const ticketUserSelect = {
  id: true,
  name: true,
  email: true,
};

class TicketRepository {
  async create(data: CreateTicketData) {
    return prisma.ticket.create({
      data,
      include: {
        user: {
          select: ticketUserSelect,
        },
      },
    });
  }

  async findAll() {
    return prisma.ticket.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: ticketUserSelect,
        },
      },
    });
  }

  async findById(id: number) {
    return prisma.ticket.findUnique({
      where: { id },
      include: {
        user: {
          select: ticketUserSelect,
        },
      },
    });
  }

  async updateStatus(id: number, data: UpdateTicketStatusData) {
    return prisma.ticket.update({
      where: { id },
      data,
      include: {
        user: {
          select: ticketUserSelect,
        },
      },
    });
  }
}

const ticketRepository = new TicketRepository();

export { ticketRepository };
export type { CreateTicketData, UpdateTicketStatusData };

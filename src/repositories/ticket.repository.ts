import { prisma } from "../lib/prisma";

type CreateTicketData = {
  description: string;
  channel: string;
  priority: string;
  status: string;
  requiresManualReview: boolean;
  userId?: number;
};

type UpdateTicketStatusData = {
  status: string;
};

type UpdateTicketData = {
  description?: string;
  channel?: string;
  priority?: string;
  requiresManualReview?: boolean;
  userId?: number;
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

  async update(id: number, data: UpdateTicketData) {
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

  async delete(id: number) {
    return prisma.ticket.delete({
      where: { id },
    });
  }
}

const ticketRepository = new TicketRepository();

export { ticketRepository };
export type { CreateTicketData, UpdateTicketStatusData, UpdateTicketData };

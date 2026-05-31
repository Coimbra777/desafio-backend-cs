import { prisma } from "../lib/prisma";

type CreateTicketData = {
  description: string;
  channel: string;
  priority: string;
  status: string;
  userId?: string;
};

class TicketRepository {
  async create(data: CreateTicketData) {
    return prisma.ticket.create({
      data,
    });
  }
}

const ticketRepository = new TicketRepository();

export { ticketRepository };
export type { CreateTicketData };

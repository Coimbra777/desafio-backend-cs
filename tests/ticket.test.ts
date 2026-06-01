import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Ticket routes", () => {
  beforeEach(async () => {
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("POST /tickets should create a ticket without user", async () => {
    const response = await request(app).post("/tickets").send({
      description: "Quero denunciar um caso de assédio",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      description: "Quero denunciar um caso de assédio",
      channel: "ouvidoria",
      priority: "alta",
      requiresManualReview: false,
      status: "open",
      userId: null,
    });
  });

  it("POST /tickets should create a ticket with userId", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Maria",
        email: "maria.ticket@example.com",
      },
    });

    const response = await request(app).post("/tickets").send({
      description: "Estou com erro de acesso ao sistema",
      userId: user.id,
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      userId: user.id,
      channel: "suporte_tecnico",
      requiresManualReview: false,
    });
    expect(response.body.user).toMatchObject({
      id: user.id,
      name: "Maria",
      email: "maria.ticket@example.com",
    });
  });

  it("POST /tickets without description should return 400", async () => {
    const response = await request(app).post("/tickets").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Description is required",
    });
  });

  it("POST /tickets with non-existent userId should return 404", async () => {
    const response = await request(app).post("/tickets").send({
      description: "Estou com erro de acesso ao sistema",
      userId: 9999,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "User not found",
    });
  });

  it("POST /tickets with invalid userId should return 400", async () => {
    const response = await request(app).post("/tickets").send({
      description: "Estou com erro de acesso ao sistema",
      userId: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid user id",
    });
  });

  it("POST /tickets should mark fora_do_escopo as manual review", async () => {
    const response = await request(app).post("/tickets").send({
      description: "Preciso falar com alguém",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      channel: "fora_do_escopo",
      priority: "baixa",
      requiresManualReview: true,
    });
  });

  it("GET /tickets should list tickets ordered by createdAt desc", async () => {
    await prisma.ticket.create({
      data: {
        description: "Ticket antigo",
        channel: "sac",
        priority: "baixa",
        status: "open",
        createdAt: new Date("2026-01-01T10:00:00.000Z"),
      },
    });

    await prisma.ticket.create({
      data: {
        description: "Ticket novo",
        channel: "financeiro",
        priority: "media",
        status: "open",
        createdAt: new Date("2026-01-02T10:00:00.000Z"),
      },
    });

    const response = await request(app).get("/tickets");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].description).toBe("Ticket novo");
    expect(response.body[1].description).toBe("Ticket antigo");
  });

  it("GET /tickets/:id should return a ticket by id", async () => {
    const ticket = await prisma.ticket.create({
      data: {
        description: "Quero cancelar minha assinatura",
        channel: "sac",
        priority: "baixa",
        status: "open",
      },
    });

    const response = await request(app).get(`/tickets/${ticket.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: ticket.id,
      description: "Quero cancelar minha assinatura",
      channel: "sac",
      priority: "baixa",
      requiresManualReview: false,
      status: "open",
    });
  });

  it("GET /tickets/:id with non-existent id should return 404", async () => {
    const response = await request(app).get("/tickets/9999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Ticket not found",
    });
  });

  it("GET /tickets/:id with invalid id should return 400", async () => {
    const response = await request(app).get("/tickets/0");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid ticket id",
    });
  });

  it('PUT /tickets/:id/status should update status to "in_progress"', async () => {
    const ticket = await prisma.ticket.create({
      data: {
        description: "Estou com erro no sistema",
        channel: "suporte_tecnico",
        priority: "media",
        status: "open",
      },
    });

    const response = await request(app).put(`/tickets/${ticket.id}/status`).send({
      status: "in_progress",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("in_progress");
  });

  it("PUT /tickets/:id/status with invalid status should return 400", async () => {
    const ticket = await prisma.ticket.create({
      data: {
        description: "Estou com erro no sistema",
        channel: "suporte_tecnico",
        priority: "media",
        status: "open",
      },
    });

    const response = await request(app).put(`/tickets/${ticket.id}/status`).send({
      status: "invalid",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid status",
    });
  });
});

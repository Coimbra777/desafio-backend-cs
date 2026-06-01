import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("User routes", () => {
  beforeEach(async () => {
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("POST /users should create a user and return 201", async () => {
    const response = await request(app).post("/users").send({
      name: "Maria Silva",
      email: "maria@example.com",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Maria Silva",
      email: "maria@example.com",
    });
    expect(response.body.id).toBeDefined();
  });

  it("GET /users should list users", async () => {
    await prisma.user.create({
      data: {
        name: "Joao",
        email: "joao@example.com",
      },
    });

    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      name: "Joao",
      email: "joao@example.com",
    });
  });

  it("GET /users/:id should return a user by id", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Ana",
        email: "ana@example.com",
      },
    });

    const response = await request(app).get(`/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: user.id,
      name: "Ana",
      email: "ana@example.com",
    });
  });

  it("PUT /users/:id should update name and email", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Carlos",
        email: "carlos@example.com",
      },
    });

    const response = await request(app).put(`/users/${user.id}`).send({
      name: "Carlos Souza",
      email: "carlos.souza@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: user.id,
      name: "Carlos Souza",
      email: "carlos.souza@example.com",
    });
  });

  it("DELETE /users/:id should remove the user and return 204", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Julia",
        email: "julia@example.com",
      },
    });

    const response = await request(app).delete(`/users/${user.id}`);

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  it("GET /users/:id after delete should return 404", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Paulo",
        email: "paulo@example.com",
      },
    });

    await request(app).delete(`/users/${user.id}`);
    const response = await request(app).get(`/users/${user.id}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "User not found",
    });
  });

  it("POST /users without name or email should return 400", async () => {
    const response = await request(app).post("/users").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Name and email are required",
    });
  });

  it("POST /users with duplicated email should return 400", async () => {
    await prisma.user.create({
      data: {
        name: "Primeiro",
        email: "duplicado@example.com",
      },
    });

    const response = await request(app).post("/users").send({
      name: "Segundo",
      email: "duplicado@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Email already in use",
    });
  });

  it("POST /users with blank name should return 400", async () => {
    const response = await request(app).post("/users").send({
      name: "   ",
      email: "maria@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Name and email are required",
    });
  });

  it("POST /users with invalid email should return 400", async () => {
    const response = await request(app).post("/users").send({
      name: "Maria",
      email: "email-invalido",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid email",
    });
  });

  it("PUT /users/:id with blank name should return 400", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Carlos",
        email: "carlos@example.com",
      },
    });

    const response = await request(app).put(`/users/${user.id}`).send({
      name: "   ",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Name cannot be empty",
    });
  });
});

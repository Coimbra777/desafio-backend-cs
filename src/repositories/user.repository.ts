import { prisma } from "../lib/prisma";

type CreateUserData = {
  name: string;
  email: string;
};

type UpdateUserData = {
  name?: string;
  email?: string;
};

class UserRepository {
  async create(data: CreateUserData) {
    return prisma.user.create({
      data,
    });
  }

  async findAll() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

const userRepository = new UserRepository();

export { userRepository };
export type { CreateUserData, UpdateUserData };

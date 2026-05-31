import { userRepository } from "../repositories/user.repository";

type CreateUserInput = {
  name?: string;
  email?: string;
};

type UpdateUserInput = {
  name?: string;
  email?: string;
};

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class UserService {
  async create(data: CreateUserInput) {
    if (!data.name || !data.email) {
      throw new AppError("Name and email are required.", 400);
    }

    const emailInUse = await userRepository.findByEmail(data.email);

    if (emailInUse) {
      throw new AppError("Email already in use.", 400);
    }

    return userRepository.create({
      name: data.name,
      email: data.email,
    });
  }

  async findAll() {
    return userRepository.findAll();
  }

  async findById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (!data.name && !data.email) {
      throw new AppError("Name or email must be provided.", 400);
    }

    if (data.email) {
      const emailInUse = await userRepository.findByEmail(data.email);

      if (emailInUse && emailInUse.id !== id) {
        throw new AppError("Email already in use.", 400);
      }
    }

    return userRepository.update(id, {
      name: data.name,
      email: data.email,
    });
  }

  async delete(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    await userRepository.delete(id);
  }
}

const userService = new UserService();

export { AppError, userService };

import { AppError } from "../errors/AppError";
import { userRepository } from "../repositories/user.repository";
import { isValidId } from "../utils/is-valid-id";

type CreateUserInput = {
  name?: string;
  email?: string;
};

type UpdateUserInput = {
  name?: string;
  email?: string;
};

class UserService {
  async create(data: CreateUserInput) {
    if (!data.name || !data.email) {
      throw new AppError("Name and email are required");
    }

    const emailInUse = await userRepository.findByEmail(data.email);

    if (emailInUse) {
      throw new AppError("Email already in use");
    }

    return userRepository.create({
      name: data.name,
      email: data.email,
    });
  }

  async findAll() {
    return userRepository.findAll();
  }

  async findById(id: number) {
    if (!isValidId(id)) {
      throw new AppError("Invalid user id");
    }

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async update(id: number, data: UpdateUserInput) {
    if (!isValidId(id)) {
      throw new AppError("Invalid user id");
    }

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!data.name && !data.email) {
      throw new AppError("Name or email must be provided");
    }

    if (data.email) {
      const emailInUse = await userRepository.findByEmail(data.email);

      if (emailInUse && emailInUse.id !== id) {
        throw new AppError("Email already in use");
      }
    }

    return userRepository.update(id, {
      name: data.name,
      email: data.email,
    });
  }

  async delete(id: number) {
    if (!isValidId(id)) {
      throw new AppError("Invalid user id");
    }

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await userRepository.delete(id);
  }
}

const userService = new UserService();

export { userService };

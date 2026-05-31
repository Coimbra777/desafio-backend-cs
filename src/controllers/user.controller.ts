import { Request, Response } from "express";
import { AppError, userService } from "../services/user.service";

type UserParams = {
  id: string;
};

class UserController {
  async create(request: Request, response: Response) {
    try {
      const user = await userService.create(request.body);

      return response.status(201).json(user);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async findAll(_request: Request, response: Response) {
    try {
      const users = await userService.findAll();

      return response.status(200).json(users);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async findById(request: Request<UserParams>, response: Response) {
    try {
      const user = await userService.findById(request.params.id);

      return response.status(200).json(user);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async update(request: Request<UserParams>, response: Response) {
    try {
      const user = await userService.update(request.params.id, request.body);

      return response.status(200).json(user);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async delete(request: Request<UserParams>, response: Response) {
    try {
      await userService.delete(request.params.id);

      return response.status(200).json({
        message: "User deleted successfully.",
      });
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  private handleError(error: unknown, response: Response) {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return response.status(500).json({
      message: "Internal server error.",
    });
  }
}

const userController = new UserController();

export { userController };

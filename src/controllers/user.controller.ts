import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";

type UserParams = {
  id: string;
};

class UserController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const user = await userService.create(request.body);

      return response.status(201).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(_request: Request, response: Response, next: NextFunction) {
    try {
      const users = await userService.findAll();

      return response.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  }

  async findById(
    request: Request<UserParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const user = await userService.findById(Number(request.params.id));

      return response.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async update(
    request: Request<UserParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const user = await userService.update(Number(request.params.id), request.body);

      return response.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async delete(
    request: Request<UserParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      await userService.delete(Number(request.params.id));

      return response.status(200).json({
        message: "User deleted successfully.",
      });
    } catch (error) {
      return next(error);
    }
  }
}

const userController = new UserController();

export { userController };

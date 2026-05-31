import { Router } from "express";
import { userController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/", (request, response, next) =>
  userController.create(request, response, next),
);
userRoutes.get("/", (request, response, next) =>
  userController.findAll(request, response, next),
);
userRoutes.get("/:id", (request, response, next) =>
  userController.findById(request, response, next),
);
userRoutes.put("/:id", (request, response, next) =>
  userController.update(request, response, next),
);
userRoutes.delete("/:id", (request, response, next) =>
  userController.delete(request, response, next),
);

export { userRoutes };

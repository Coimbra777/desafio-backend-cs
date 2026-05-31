import { Router } from "express";
import { userController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/", (request, response) =>
  userController.create(request, response),
);
userRoutes.get("/", (request, response) =>
  userController.findAll(request, response),
);
userRoutes.get("/:id", (request, response) =>
  userController.findById(request, response),
);
userRoutes.put("/:id", (request, response) =>
  userController.update(request, response),
);
userRoutes.delete("/:id", (request, response) =>
  userController.delete(request, response),
);

export { userRoutes };

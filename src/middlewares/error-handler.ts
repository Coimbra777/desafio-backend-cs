import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";

const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    console.error("AppError:", error.message);
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  return response.status(500).json({
    message: "Internal server error",
  });
};

export { errorHandler };

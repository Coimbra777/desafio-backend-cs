import { Request, Response, NextFunction } from "express";

function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (process.env.NODE_ENV === "test") {
    next();
    return;
  }

  const startedAt = Date.now();

  response.on("finish", () => {
    const durationMs = Date.now() - startedAt;

    console.log(
      JSON.stringify({
        method: request.method,
        path: request.path,
        statusCode: response.statusCode,
        durationMs,
      }),
    );
  });

  next();
}

export { requestLogger };

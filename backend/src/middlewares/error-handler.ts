import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: err.status || 401,
      message: err?.message,
    });
  }
  const error = err || {};
  req.app.get("env") === "production" ? null : { ...error, stack: err?.stack };

  const errorObj = {
    status: err?.status || 500,
    message: err?.message,
    error,
  };

  res.status(err?.status || 500).json(errorObj);
};

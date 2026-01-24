import { Response } from "express";
import { ApiResponse } from "./apiResponse";

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: Record<string, unknown>
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };

  res.status(statusCode).json(response);
}

import { Response } from "express";

interface CommonResponse {
  res: Response;
  statusCode?: number;
}

interface SendResponse<T> extends CommonResponse {
  data: T;
}

interface SendError extends CommonResponse {
  message: string;
  errors?: any[] | null;
}

export class ResponseUtil {
  static sendResponse<T>({ res, data, statusCode = 200 }: SendResponse<T>) {
    return res.status(statusCode).send({
      success: true,
      message: "Success",
      data,
    });
  }

  static sendError({ res, errors, message, statusCode = 500 }: SendError) {
    return res.status(statusCode).send({
      success: false,
      message,
      errors,
    });
  }
}

import { Response } from 'express';
import RESPONSE_CODES from '../constants/ResponseCodes';

interface CommonResponse {
  res: Response;
  statusCode?: number;
}

interface SendResponse<T> extends CommonResponse {
  data: T;
}

interface SendError extends CommonResponse {
  message: string;
  errors?: unknown[] | null;
}

export class ResponseUtil {
  static sendResponse<T>({ res, data, statusCode = RESPONSE_CODES.SUCCESS }: SendResponse<T>) {
    return res.status(statusCode).send({
      success: true,
      message: 'Success',
      data
    });
  }

  static sendError({ res, errors, message, statusCode = RESPONSE_CODES.ERROR_INTERNAL_SERVER }: SendError) {
    return res.status(statusCode).send({
      success: false,
      message,
      errors
    });
  }
}

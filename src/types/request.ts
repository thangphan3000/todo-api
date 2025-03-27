import { Request } from 'express';

export interface LoggingRequest extends Request {
  correlation_id: string;
}

import { Request } from 'express';

export interface LoggingRequest extends Request {
  correlationId: string;
}

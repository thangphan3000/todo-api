import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/Response';

export class HealthCheckController {
  async checkHealth(req: Request, res: Response) {
    ResponseUtil.sendResponse({
      res,
      data: null
    });
  }
}

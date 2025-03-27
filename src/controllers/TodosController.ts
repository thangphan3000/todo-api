import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/Response';
import TodosService from '../services/TodosService';
import logger from '../utils/Logger';
import { LoggingRequest } from '../types/request';

export class TodosController {
  async getTodos(_req: Request, res: Response) {
    const todos = await TodosService.getTodos();

    ResponseUtil.sendResponse({
      res,
      data: todos
    });

    return;
  }

  async getTodo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { correlationId } = req as LoggingRequest;
      const parsedId = parseInt(id);
      const todo = await TodosService.getTodoById(parsedId);

      if (!todo) {
        logger.error(`Todo not found`, { metadata: { todoId: id }, correlationId });

        ResponseUtil.sendError({
          res,
          message: 'Todo not found',
          statusCode: 404
        });

        return;
      }

      ResponseUtil.sendResponse({
        res,
        data: todo
      });
    } catch (err: unknown) {
      logger.error(err);

      ResponseUtil.sendError({
        res,
        message: 'Internal server'
      });
    }
  }

  async createTodo(req: Request, res: Response) {
    const todoData = req.body;
    const todo = await TodosService.createTodo(todoData);

    ResponseUtil.sendResponse({ res, data: todo, statusCode: 201 });
  }

  async deleteTodo(req: Request, res: Response) {
    const { id } = req.params;
    const { correlationId } = req as LoggingRequest;
    const parsedId = parseInt(id);
    const isDeleted = await TodosService.deleteTodo(parsedId);

    if (!isDeleted) {
      logger.error(`Todo not found`, { metadata: { todoId: id }, correlationId });

      ResponseUtil.sendError({
        res,
        message: 'Todo not found',
        statusCode: 404
      });

      return;
    }

    ResponseUtil.sendResponse({ res, data: null });
  }
}

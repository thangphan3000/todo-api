import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/Response';
import TodosService from '../services/TodosService';

export class TodosController {
  async getTodos(req: Request, res: Response) {
    const todos = await TodosService.getTodos();

    ResponseUtil.sendResponse({
      res,
      data: todos
    });

    return;
  }

  async getTodo(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const todo = await TodosService.getTodoById(parsedId);

    ResponseUtil.sendResponse({
      res,
      data: todo
    });
  }

  async createTodo(req: Request, res: Response) {
    const todoData = req.body;
    const todo = await TodosService.createTodo(todoData);

    ResponseUtil.sendResponse({ res, data: todo, statusCode: 201 });
  }

  async deleteTodo(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const isDeleted = await TodosService.deleteTodo(parsedId);

    if (!isDeleted) {
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

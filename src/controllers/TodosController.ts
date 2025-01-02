import { AppDataSource } from "../database/data-source";
import { Todo } from "../entities/Todo";
import { Request, Response } from "express";
import { ResponseUtil } from "../utils/Response";

export class TodosController {
  async getTodos(req: Request, res: Response) {
    const todos = await AppDataSource.getRepository(Todo).find();

    ResponseUtil.sendResponse({
      res,
      data: todos,
    });
    return;
  }

  async getTodo(req: Request, res: Response) {
    const { id } = req.params;
    const todo = await AppDataSource.getRepository(Todo).findOneBy({
      id: parseInt(id),
    });

    ResponseUtil.sendResponse({
      res,
      data: todo,
    });
  }

  async createTodo(req: Request, res: Response) {
    const todoData = req.body;
    const repo = AppDataSource.getRepository(Todo);
    const todo = repo.create(todoData);
    await repo.save(todo);

    ResponseUtil.sendResponse({ res, data: todo, statusCode: 201 });
  }

  async updateTodo(req: Request, res: Response) {
    const { id } = req.params;
    const todoData = req.body;
    const repo = AppDataSource.getRepository(Todo);
    const todo = await repo.findOneBy({ id: parseInt(id) });

    if (!todo) {
      ResponseUtil.sendError({
        res,
        message: "Todo not found",
        statusCode: 404,
      });
      return;
    }

    repo.merge(todo, todoData);
    await repo.save(todo);

    ResponseUtil.sendResponse({ res, data: todo });
  }

  async deleteTodo(req: Request, res: Response) {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Todo);
    const todo = await repo.findOneBy({
      id: parseInt(id),
    });

    if (!todo) {
      ResponseUtil.sendError({
        res,
        message: "Todo not found",
        statusCode: 404,
      });
      return;
    }

    await repo.remove(todo);

    ResponseUtil.sendResponse({ res, data: null });
  }
}

import { AppDataSource } from "../database/data-source";
import { Todo } from "../entities/Todo";

type TodoData = Pick<Todo, "content">;

export default class TodosService {
  static async getTodos(): Promise<Todo[]> {
    return await AppDataSource.getRepository(Todo).find();
  }

  static async getTodoById(id: number): Promise<Todo | null> {
    return await AppDataSource.getRepository(Todo).findOneBy({
      id,
    });
  }

  static async createTodo(todoData: TodoData) {
    const repo = AppDataSource.getRepository(Todo);
    const todo = repo.create(todoData);

    return repo.save(todo);
  }

  static async deleteTodo(id: number): Promise<boolean> {
    const todo = await this.getTodoById(id);

    if (!todo) return false;

    const repo = AppDataSource.getRepository(Todo);
    await repo.remove(todo);

    return true;
  }
}

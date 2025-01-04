import request from "supertest";
import startApp from "../../utils/TestServer";
import TodosService from "../../services/TodosService";
import { Todo } from "../../entities/Todo";
import RESPONSE_CODES from "../../constants/ResponseCodes";

jest.mock("../../services/TodosService");

describe("TodosController", () => {
  const app = startApp();

  afterAll(() => {
    app.close();
  });

  it("get todos and returns success response", async () => {
    const mockTodos: Todo[] = [
      { id: 1, content: "Eat banana" },
      { id: 2, content: "Drink water" },
    ];
    (TodosService.getTodos as jest.Mock).mockResolvedValue(mockTodos);

    const res = await request(app).get("/api/todos");

    expect(res.status).toBe(RESPONSE_CODES.SUCCESS);
    expect(res.body).toStrictEqual({
      success: true,
      message: "Success",
      data: mockTodos,
    });
  });

  it("get a todo and returns success response", async () => {
    const mockTodo: Todo = { id: 1, content: "Eat banana" };
    (TodosService.getTodoById as jest.Mock).mockResolvedValue(mockTodo);

    const res = await request(app).get(`/api/todos/${mockTodo.id}`);

    expect(res.status).toBe(RESPONSE_CODES.SUCCESS);
    expect(res.body).toStrictEqual({
      success: true,
      message: "Success",
      data: mockTodo,
    });
  });

  it("creates a new todo and returns success response", async () => {
    const requestBody: Pick<Todo, "content"> = { content: "New todo item" };
    const mockTodo: Todo = { id: 1, content: requestBody.content };
    (TodosService.createTodo as jest.Mock).mockResolvedValue(mockTodo);

    const res = await request(app).post(`/api/todos`).send(requestBody);

    expect(res.status).toBe(RESPONSE_CODES.CREATED);
    expect(res.body).toStrictEqual({
      success: true,
      message: "Success",
      data: mockTodo,
    });
  });

  describe("when delete a todo", () => {
    describe("when todo do not exist", () => {
      it("do not delete a todo and returns not found response", async () => {
        const isDeletedTodo = false;
        const todoId = 2;
        (TodosService.deleteTodo as jest.Mock).mockResolvedValue(isDeletedTodo);

        const res = await request(app).delete(`/api/todos/${todoId}`);

        expect(res.status).toBe(RESPONSE_CODES.NOT_FOUND);
        expect(res.body).toStrictEqual({
          success: false,
          message: "Todo not found",
        });
      });
    });

    describe("when todo exists", () => {
      it("deletes a todo and returns success response", async () => {
        const isDeletedTodo = true;
        const todoId = 2;
        (TodosService.deleteTodo as jest.Mock).mockResolvedValue(isDeletedTodo);

        const res = await request(app).delete(`/api/todos/${todoId}`);

        expect(res.status).toBe(RESPONSE_CODES.SUCCESS);
        expect(res.body).toStrictEqual({
          success: true,
          message: "Success",
          data: null,
        });
      });
    });
  });
});

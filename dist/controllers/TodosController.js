"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosController = void 0;
const Response_1 = require("../utils/Response");
const TodosService_1 = __importDefault(require("../services/TodosService"));
class TodosController {
    getTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const todos = yield TodosService_1.default.getTodos();
            Response_1.ResponseUtil.sendResponse({
                res,
                data: todos,
            });
            return;
        });
    }
    getTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const parsedId = parseInt(id);
            const todo = yield TodosService_1.default.getTodoById(parsedId);
            Response_1.ResponseUtil.sendResponse({
                res,
                data: todo,
            });
        });
    }
    createTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const todoData = req.body;
            const todo = yield TodosService_1.default.createTodo(todoData);
            Response_1.ResponseUtil.sendResponse({ res, data: todo, statusCode: 201 });
        });
    }
    deleteTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const parsedId = parseInt(id);
            const isDeleted = yield TodosService_1.default.deleteTodo(parsedId);
            if (!isDeleted) {
                Response_1.ResponseUtil.sendError({
                    res,
                    message: "Todo not found",
                    statusCode: 404,
                });
                return;
            }
            Response_1.ResponseUtil.sendResponse({ res, data: null });
        });
    }
}
exports.TodosController = TodosController;

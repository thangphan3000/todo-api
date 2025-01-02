import { Router } from "express";
import { TodosController } from "../controllers/TodosController";

const authController = new TodosController();
const router = Router();

router.get("/", authController.getTodos);
router.get("/:id", authController.getTodo);
router.post("/", authController.createTodo);
router.patch("/:id", authController.updateTodo);
router.delete("/:id", authController.deleteTodo);

export default router;

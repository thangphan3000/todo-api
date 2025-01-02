import { Router } from "express";
import { UsersController } from "../controllers/UsersController";

const usersController = new UsersController();
const router = Router();

router.get("/", usersController.getUsers);

export default router;

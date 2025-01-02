import { Router } from "express";
import { AuthController } from "controllers/AuthController";

const authController = new AuthController();
const router = Router();

router.get("/sign-up", authController.signUp);
router.get("/log-in", authController.login);
router.get("/log-out", authController.logOut);

export default router;

import { Router } from "express";
import { HealthCheckController } from "../controllers/HealthCheckController";

const healthCheckController = new HealthCheckController();
const router = Router();

router.get("/", healthCheckController.checkHealth);

export default router;

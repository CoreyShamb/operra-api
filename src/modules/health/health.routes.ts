import { Router } from "express";
import {
    healthCheckHandler,
    livenessCheckHandler,
    readinessCheckHandler,
} from "./health.controller";

const router = Router();

router.get("/", healthCheckHandler);
router.get("/live", livenessCheckHandler);
router.get("/ready", readinessCheckHandler);

export default router;
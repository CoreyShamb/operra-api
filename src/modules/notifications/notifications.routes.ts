import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { sendNotificationHandler } from "./notifications.controller";

const router = Router();

router.use(authenticate);

router.post("/send", sendNotificationHandler);

export default router;

import { Router } from "express";
import { sendWebhookHandler } from "./webhook.controller";

const router = Router();

router.post("/send", sendWebhookHandler);

export default router;
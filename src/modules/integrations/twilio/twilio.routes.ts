import { Router } from "express";
import { sendTwilioSmsHandler } from "./twilio.controller";

const router = Router();

router.post("/send", sendTwilioSmsHandler);

export default router;
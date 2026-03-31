import { Router } from "express";
import { sendMailgunEmailHandler } from "./mailgun.controller";

const router = Router();

router.post("/send", sendMailgunEmailHandler);

export default router;
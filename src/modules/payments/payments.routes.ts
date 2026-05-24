import { Router } from "express";
import express from "express";
import { createCheckout } from "./payments.controller";
import { stripeWebhook } from "./webhook.handler";

const router = Router();

// Stripe requires the raw body for webhook signature verification
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
);

router.post("/checkout", createCheckout);

export default router;

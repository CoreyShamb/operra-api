import express from "express";
import bodyParser from "body-parser";
import { stripeWebhook } from "./modules/payments/webhook.handler";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Operra API is running",
  });
});

app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

export default app;
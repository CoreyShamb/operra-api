import express from "express";
import bodyParser from "body-parser";
import { stripeWebhook } from "./modules/payments/webhook.handler";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Operra API is running",
  });
});

app.use("/auth", authRoutes);

app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

export default app;
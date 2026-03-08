import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import { stripeWebhook } from "./modules/payments/webhook.handler";

const app = express();

app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Operra API is running",
  });
});

app.use(routes);

export default app;
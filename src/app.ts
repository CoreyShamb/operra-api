import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import { stripeWebhook } from "./modules/payments/webhook.handler";
import { errorMiddleware } from "./core/middleware/error.middleware";

const app = express();

app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());

app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Operra API is running",
  });
});

app.use(routes);
app.use(errorMiddleware);

export default app;

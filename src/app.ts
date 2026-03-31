import express from "express";
import routes from "./routes";
import { stripeWebhook } from "./modules/billing/webhook.controller";
import { errorMiddleware } from "./core/middleware/error.middleware";
import billingRoutes from "./modules/billing/billing.routes";
import bookingRoutes from "./modules/bookings/bookings.routes";

const app = express();

app.post(
  "/api/v1/billing/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());

app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Operra API is running",
  });
});

app.use("/api/v1/billing", billingRoutes);
app.use("/api/v1/bookings", bookingRoutes); // ✅ ADD THIS

app.use(routes);
app.use(errorMiddleware);

export default app;
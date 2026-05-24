import express from "express";
import routes from "./routes";
import { stripeWebhook } from "./modules/billing/webhook.controller";
import { errorMiddleware } from "./core/middleware/error.middleware";
import bookingRoutes from "./modules/bookings/bookings.routes";
import customerRoutes from "./modules/customers/customers.routes";
import healthRoutes from "./modules/health/health.routes";
import integrationRoutes from "./modules/integrations/integrations.routes";
import mailgunRoutes from "./modules/integrations/mailgun/mailgun.routes";
import twilioRoutes from "./modules/integrations/twilio/twilio.routes";
import stripeRoutes from "./modules/integrations/stripe/stripe.routes";
import webhookRoutes from "./modules/integrations/webhook/webhook.routes";
import aiRoutes from "./modules/ai/ai.routes";

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

app.use("/api/v1", routes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/integrations", integrationRoutes);
app.use("/api/v1/integrations/mailgun", mailgunRoutes);
app.use("/api/v1/integrations/twilio", twilioRoutes);
app.use("/api/v1/integrations/stripe", stripeRoutes);
app.use("/api/v1/integrations/webhook", webhookRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use(errorMiddleware);

export default app;
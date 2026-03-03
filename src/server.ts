import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { stripeWebhook } from "./modules/payments/webhook.handler";

const app = express();

app.post(
    "/api/webhook",
    bodyParser.raw({ type: "application/json" }),
    stripeWebhook
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
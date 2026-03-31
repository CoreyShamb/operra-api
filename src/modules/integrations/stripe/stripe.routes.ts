import { Router } from "express";
import {
    createCheckoutSessionHandler,
    createBillingPortalHandler,
} from "./stripe.controller";

const router = Router();

router.post("/checkout", createCheckoutSessionHandler);
router.post("/portal", createBillingPortalHandler);

export default router;
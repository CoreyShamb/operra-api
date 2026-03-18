import { Router } from "express";
import {
    getSubscription,
    createCheckoutSession,
    createBillingPortalSession,
} from "./billing.controller";

const router = Router();

router.get("/:organizationId/subscription", getSubscription);
router.post("/:organizationId/checkout", createCheckoutSession);
router.post("/:organizationId/portal", createBillingPortalSession);

export default router;
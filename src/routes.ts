import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import apiKeysRoutes from "./modules/api-keys/api-keys.routes";
import apiKeysProtectedRoutes from "./modules/api-keys/api-keys.protected.routes";
import usageAnalyticsRoutes from "./modules/analytics/usage-analytics.routes";
import billingRoutes from "./modules/billing/billing.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/api-keys", apiKeysRoutes);
router.use("/api-keys", apiKeysProtectedRoutes);
router.use("/analytics", usageAnalyticsRoutes);
router.use("/billing", billingRoutes);

export default router;
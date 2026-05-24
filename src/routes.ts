import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import apiKeysRoutes from "./modules/api-keys/api-keys.routes";
import apiKeysProtectedRoutes from "./modules/api-keys/api-keys.protected.routes";
import usageAnalyticsRoutes from "./modules/analytics/usage-analytics.routes";
import billingRoutes from "./modules/billing/billing.routes";
import paymentsRoutes from "./modules/payments/payments.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import membershipsRoutes from "./modules/memberships/memberships.routes";
import usersRoutes from "./modules/users/users.routes";
import organizationsRoutes from "./modules/organizations/organizations.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/organizations", organizationsRoutes);
router.use("/api-keys", apiKeysRoutes);
router.use("/api-keys", apiKeysProtectedRoutes);
router.use("/analytics", usageAnalyticsRoutes);
router.use("/billing", billingRoutes);
router.use("/payments", paymentsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/memberships", membershipsRoutes);

export default router;
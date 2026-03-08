import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import organizationRoutes from "../modules/organizations/organizations.routes";
import apiKeysRoutes from "../modules/api-keys/api-keys.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/", apiKeysRoutes);

export default router;
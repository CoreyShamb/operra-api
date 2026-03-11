import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import apiKeysRoutes from "./modules/api-keys/api-keys.routes";
import apiKeysProtectedRoutes from "./modules/api-keys/api-keys.protected.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/api-keys", apiKeysRoutes);
router.use(apiKeysProtectedRoutes);

export default router;
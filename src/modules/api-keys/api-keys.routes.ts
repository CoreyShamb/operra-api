import { Router } from "express";
import {
    createApiKey,
    getApiKeys,
    revokeApiKey,
} from "./api-keys.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

router.post("/organizations/:organizationId/api-keys", authenticate, createApiKey);
router.get("/organizations/:organizationId/api-keys", authenticate, getApiKeys);
router.delete(
    "/organizations/:organizationId/api-keys/:apiKeyId",
    authenticate,
    revokeApiKey
);

export default router;
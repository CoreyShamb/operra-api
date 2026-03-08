import { Router } from "express";
import { createOrganization, getOrganizations } from "./organizations.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

router.post("/", authenticate, createOrganization);
router.get("/", authenticate, getOrganizations);

export default router;
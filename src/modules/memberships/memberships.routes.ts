import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import {
    addMemberHandler,
    getMembersHandler,
    removeMemberHandler,
    updateMemberRoleHandler,
} from "./memberships.controller";

const router = Router();

router.use(authenticate);

router.get("/", getMembersHandler);
router.post("/", addMemberHandler);
router.patch("/:id", updateMemberRoleHandler);
router.delete("/:id", removeMemberHandler);

export default router;

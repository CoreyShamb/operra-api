import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import {
    changePasswordHandler,
    deleteMeHandler,
    getMeHandler,
    updateMeHandler,
} from "./users.controller";

const router = Router();

router.use(authenticate);

router.get("/me", getMeHandler);
router.patch("/me", updateMeHandler);
router.patch("/me/password", changePasswordHandler);
router.delete("/me", deleteMeHandler);

export default router;

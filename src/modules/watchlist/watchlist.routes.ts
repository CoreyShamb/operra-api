import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { watchlistController } from "./watchlist.controller";

const router = Router();

router.get("/", authenticate, watchlistController.getAll);
router.post("/", authenticate, watchlistController.add);
router.delete("/:symbol", authenticate, watchlistController.remove);

export default router;
import { Router } from "express";
import { stocksController } from "./stocks.controller";

const router = Router();

router.get("/search", stocksController.search);
router.get("/quotes", stocksController.quotes);
router.get("/movers", stocksController.movers);
router.get("/profile/:symbol", stocksController.profile);
router.get("/news/:symbol", stocksController.news);
router.get("/quote/:symbol", stocksController.quote);

export default router;
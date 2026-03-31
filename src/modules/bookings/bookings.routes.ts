import { Router } from "express";
import {
    createBookingHandler,
    deleteBookingHandler,
    getBookingByIdHandler,
    getBookingsHandler,
    updateBookingHandler,
} from "./bookings.controller";

const router = Router();

router.post("/", createBookingHandler);
router.get("/", getBookingsHandler);
router.get("/:id", getBookingByIdHandler);
router.patch("/:id", updateBookingHandler);
router.delete("/:id", deleteBookingHandler);

export default router;
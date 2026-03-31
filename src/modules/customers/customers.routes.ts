import { Router } from "express";
import {
    createCustomerHandler,
    deleteCustomerHandler,
    getCustomerByIdHandler,
    getCustomersHandler,
    updateCustomerHandler,
} from "./customers.controller";

const router = Router();

router.post("/", createCustomerHandler);
router.get("/", getCustomersHandler);
router.get("/:id", getCustomerByIdHandler);
router.patch("/:id", updateCustomerHandler);
router.delete("/:id", deleteCustomerHandler);

export default router;
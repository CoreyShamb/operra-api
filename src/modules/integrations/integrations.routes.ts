import { Router } from "express";
import {
    connectIntegrationHandler,
    disconnectIntegrationHandler,
    getIntegrationsHandler,
} from "./integrations.controller";

const router = Router();

router.get("/", getIntegrationsHandler);
router.post("/connect", connectIntegrationHandler);
router.post("/disconnect", disconnectIntegrationHandler);

export default router;
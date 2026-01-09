import { Router } from "express";
import { logController } from "./log.controller";
import auth from "../../middleware/auth";
import { Role } from "../../generated/prisma/enums";

const logRouter = Router();

logRouter.post('/', auth([Role.Admin]), logController.createUsageLog);
logRouter.get('/', logController.getUsageLog);
logRouter.patch('/:id', auth(), logController.updateUsageLog);

export default logRouter;
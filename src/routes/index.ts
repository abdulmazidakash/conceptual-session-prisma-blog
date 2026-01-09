import { Router } from "express";
import userRouter from "../modules/user/user.route";
import equipmentRouter from "../modules/equipment/equipment.route";
import logRouter from "../modules/usage-log/log.route";

const routes = Router();

routes.use('/user', userRouter);
routes.use('/equipment', equipmentRouter);
routes.use('/usageLog', logRouter);

export default routes;
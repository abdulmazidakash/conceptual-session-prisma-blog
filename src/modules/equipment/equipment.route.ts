import { Router } from "express";
import { equipmentController } from "./equipment.controller";
import auth from "../../middleware/auth";

const equipmentRouter = Router();

equipmentRouter.post('/', auth("equipment", "create"), equipmentController.createEquipment);
equipmentRouter.get('/', auth("equipment", "read"), equipmentController.getEquipment);

export default equipmentRouter;
import { RequestHandler } from "express";
import { prisma } from "../../lib/prisma";

const createEquipment: RequestHandler = async (req, res) => {
    try {
        const payload = req.body;
        const equipment = await prisma.equipment.create({
            data: payload,
        })

        res.send({ message: "Equipment Added", data: equipment });
    } catch (error) {
        
    }
};

export const equipmentController = {
    createEquipment,
}
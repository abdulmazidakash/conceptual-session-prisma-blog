import { RequestHandler } from "express";
import { prisma } from "../../lib/prisma";

const createUsageLog: RequestHandler = async (req, res) => {

    console.log(req.user);
    try {
        const payload = req.body;
        const log = await prisma.usageLog.create({ data: { ...payload, userId: req.user.id } });

        res.send({ message: "log successfully created", log })
    } catch (error) {
        res.send({ message: "log getting error", error })
    }
};


const getUsageLog: RequestHandler = async (req, res) => {
    try {
        const log = await prisma.usageLog.findMany({
            include: { user: true, equipment: true }
        });

        res.send({ message: "log fetched successfully", data: log })
    } catch (error) {
        res.send({ message: "log fetched failed", error })
    }
};

const updateUsageLog: RequestHandler = async(req, res)=>{
    const { id } = req.params;
    if(!id) return res.send("please provided id");

    try {
        const log = await prisma.usageLog.update({
            where: {
                id
            },
            data: {
                endTime: new Date(),
            }
        })

        res.send({message:"log updated successfully", data: log})
    } catch (error) {
        res.send({message: "log getting error", error});
    }
}

export const logController = {
    createUsageLog,
    getUsageLog,
    updateUsageLog,
}
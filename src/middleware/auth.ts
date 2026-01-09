import { NextFunction, Request, Response } from "express";
import { Role } from "../generated/prisma/enums";
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

const auth = (roles?: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) res.send("please provide token");

        try {
            const decoded = jwt.verify(token as string, "very secret");
            console.log(decoded);

            if (!decoded) return res.send("Unauthorized");

            req.user = decoded as JwtPayload;

            if (roles && !roles.includes(req.user.role)) {
                res.send({ message: "forbidden" })
            }

            next();
        } catch (error) {
            console.error(error);
        }
    }
};

export default auth;
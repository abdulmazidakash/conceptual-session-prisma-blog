import { NextFunction, Request, Response } from "express";
// import { Role } from "../generated/prisma/enums";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { auth as betterAuth } from '../lib/auth'

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

const auth = (resource: "user" | "equipment", action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // const token = req.headers.authorization?.split(" ")[1];

        // if (!token) res.send("please provide token");

        try {
            //     const decoded = jwt.verify(token as string, "very secret");
            //     console.log(decoded);

            //     if (!decoded) return res.send("Unauthorized");

            //     req.user = decoded as JwtPayload;

            //     if (roles && !roles.includes(req.user.role)) {
            //         res.send({ message: "forbidden" })
            //     }

            //=============better auth ====================
            const session = await betterAuth.api.getSession({
                headers: req.headers,
            });


            if (!session) res.status(401).send({ message: "Unauthorized!" });

            const hasPermission = await betterAuth.api.userHasPermission({
                body: {
                    userId: session?.user.id,
                    role: session?.user.role || "user" as any,
                    permission: {
                        [resource]: [action]
                    }
                }
            });

            // console.log({session, hasPermission});
            if (!hasPermission || !hasPermission.success) res.status(401).send({ message: `forbidden: You do not have permission to ${action} ${resource}` })

            next();
        } catch (error) {
            console.error(error);
        }
    }
};

export default auth;
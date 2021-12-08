import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

interface UserPayload {
    id: string;
    email: string;
}

export function currentUser(req: Request, res: Response, next: NextFunction) {
    if (!req.session?.jwt) {
        // !req.session || !req.session.jwt

        return next();
    }

    try {
        const payload = jwt.verify(
            req.session.jwt,
            process.env.JWT_SECRET!
        ) as UserPayload;
        req.currentUser = payload;
    } catch (err) {}

    next();
}

import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof CustomError) {
        console.log(err.serializeErrors());
        return res.status(err.statusCode).json({
            errors: err.serializeErrors(),
        });
    }

    res.status(400).send({
        errors: [{ message: "Something went wrong" }],
    });
}

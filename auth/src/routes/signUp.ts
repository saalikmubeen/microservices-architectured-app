import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

import {
    BadRequestError,
    requestValidationMiddleware,
} from "@microservices-node-react/common";
// import { requestValidationMiddleware } from "../middlewares/requestValidation-middleware";
// import { BadRequestError } from "../errors/BadRequestError";

const router = express.Router();

router.post(
    "/api/users/signUp",
    [
        body("email").isEmail().withMessage("Email must be provided"),
        body("password")
            .trim()
            .isLength({ min: 5, max: 20 })
            .withMessage("Password must be between 5 and 20 characters"),
    ],
    requestValidationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            next(new BadRequestError("User already exists"));
        }

        const newUser = await User.createUser({ email, password });

        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
            },
            process.env.JWT_SECRET!
        );

        // req.session.jwt = token;
        req.session = {
            jwt: token,
        };

        res.status(201).json(newUser);
    }
);

export { router as signUpRouter };

import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Password } from "../utils/Password";

// import { BadRequestError } from "../errors/BadRequestError";
// import { requestValidationMiddleware } from "../middlewares/requestValidation-middleware";
import {
    BadRequestError,
    requestValidationMiddleware,
} from "@microservices-node-react/common";

const router = express.Router();

router.post(
    "/api/users/signIn",
    [
        body("email").isEmail().withMessage("Email must be provided"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password must be provided"),
    ],
    requestValidationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            next(new BadRequestError("Invalid email or password!"));
            return;
        }

        const passwordMatch = await Password.comparePassword(
            user.password,
            password
        );

        if (!passwordMatch) {
            next(new BadRequestError("Invalid email or password!"));
            return;
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET!
        );

        req.session = {
            jwt: token,
        };

        res.status(200).json(user);
    }
);

export { router as signInRouter };

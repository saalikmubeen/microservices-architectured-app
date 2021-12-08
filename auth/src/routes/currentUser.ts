import express, { Request, Response } from "express";
// import { currentUser } from "../middlewares/currentUser";
import { currentUser } from "@microservices-node-react/common";

const router = express.Router();

router.get(
    "/api/users/currentUser",
    currentUser,
    (req: Request, res: Response) => {
        res.send({ currentUser: req.currentUser || null });
    }
);

export { router as currentUserRouter };

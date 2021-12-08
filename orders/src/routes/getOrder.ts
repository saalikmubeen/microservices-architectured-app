import express, { NextFunction, Request, Response } from "express";
import {
    NotFoundError,
    NotAuthorizedError,
    requireAuth,
} from "@microservices-node-react/common";
import { Order } from "../models/Order";

const router = express.Router();

router.get(
    "/api/orders/:id",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.id).populate("ticket");

        if (!order) {
            return next(new NotFoundError());
        }

        if (order.userId !== req.currentUser!.id) {
            return next(new NotAuthorizedError());
        }

        res.status(200).send(order);
    }
);

export { router as getOrderRouter };

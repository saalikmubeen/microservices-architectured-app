import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
} from "@microservices-node-react/common";

import { Order } from "../models/Order";
import { OrderCancelledPublisher } from "../nats-events/publishers/OrderCancelledPublisher";
import { natsInitializer } from "../natsInitializer";

const router = express.Router();

router.delete(
    "/api/orders/:id",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new NotFoundError());
        }

        if (order.userId !== req.currentUser!.id) {
            return next(new NotAuthorizedError());
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        const publisher = new OrderCancelledPublisher(natsInitializer.client);

        await publisher.publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price,
            },
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
        });

        res.status(204).send(order);
    }
);

export { router as cancelOrderRouter };

import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    requestValidationMiddleware,
    NotFoundError,
    OrderStatus,
    BadRequestError,
} from "@microservices-node-react/common";
import mongoose from "mongoose";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";
import { OrderCreatedPublisher } from "../nats-events/publishers/OrderCreatedPublisher";
import { natsInitializer } from "../natsInitializer";

const router = express.Router();

const EXPIRATION_WINDOW_MINUTES = 1;

router.post(
    "/api/orders",
    requireAuth,
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("TicketId must be provided"),
    ],
    requestValidationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        const ticket = await Ticket.findById(req.body.ticketId);

        if (!ticket) {
            return next(new NotFoundError());
        }

        const order = await Order.find({
            ticket: ticket,
            status: {
                $in: [
                    OrderStatus.Created,
                    OrderStatus.AwaitingPayment,
                    OrderStatus.Complete,
                ],
            },
        });

        if (order.length > 0) {
            return next(new BadRequestError("This ticket is already reserved"));
        }

        const now = new Date();

        const expiration = new Date(
            now.getTime() + EXPIRATION_WINDOW_MINUTES * 60000
        );

        const newOrder = await Order.createOrder({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            ticket: ticket,
            expiresAt: expiration,
        });

        const publisher = new OrderCreatedPublisher(natsInitializer.client);

        await publisher.publish({
            id: newOrder.id,
            status: newOrder.status,
            userId: newOrder.userId,
            ticket: {
                id: newOrder.ticket.id,
                price: newOrder.ticket.price,
            },
            expiresAt: newOrder.expiresAt.toISOString(),
            version: newOrder.version,
        });

        res.status(201).send(newOrder);
    }
);

export { router as createOrderRouter };

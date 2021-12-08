import express, { NextFunction, Request, Response } from "express";
import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    requestValidationMiddleware,
    requireAuth,
    OrderStatus,
} from "@microservices-node-react/common";
import { Order } from "../models/Order";
import { Payment } from "../models/Payment";
import { body } from "express-validator";

import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../nats-events/publishers/PaymentCreatedPublisher";
import { natsInitializer } from "../natsInitializer";

const router = express.Router();

router.post(
    "/api/payments",
    requireAuth,
    [
        body("token").not().isEmpty().withMessage("Token is required"),
        body("orderId").not().isEmpty().withMessage("OrderId is required"),
    ],
    requestValidationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return next(new NotFoundError());
        }

        if (order.userId !== req.currentUser!.id) {
            return next(new NotAuthorizedError());
        }

        if (order.status === OrderStatus.Cancelled) {
            return next(
                new BadRequestError("Cannot pay for an cancelled order")
            );
        }

        const charge = await stripe.charges.create({
            currency: "INR",
            amount: order.price * 100,
            source: token,
            description: `Payment for order ${order.id} and user ${order.userId}`,
        });

        const payment = await Payment.createPayment({
            orderId: order.id,
            userId: order.userId,
            chargeId: charge.id,
        });

        await new PaymentCreatedPublisher(natsInitializer.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
            chargeId: payment.chargeId,
        });

        res.status(201).send({ payment });
    }
);

export { router as createPaymentRouter };

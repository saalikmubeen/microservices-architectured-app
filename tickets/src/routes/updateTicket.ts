import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    requestValidationMiddleware,
    NotAuthorizedError,
    NotFoundError,
    BadRequestError,
} from "@microservices-node-react/common";

import { Ticket } from "../models/Ticket";
import { natsInitializer } from "../natsInitializer";
import { TicketUpdatedPublisher } from "../nats-events/publishers/TicketUpdatedPublisher";

const router = express.Router();

router.put(
    "/api/tickets/:id",
    requireAuth,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0"),
    ],
    requestValidationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return next(new NotFoundError());
        }

        if (ticket!.userId !== req.currentUser!.id) {
            return next(new NotAuthorizedError());
        }

        if (ticket.orderId) {
            return next(new BadRequestError("Cannot edit a reserved ticket"));
        }

        ticket.title = req.body.title;
        ticket.price = req.body.price;

        // const updatedTicket = await Ticket.findByIdAndUpdate(
        //     req.params.id,
        //     { title: req.body.title, price: req.body.price },
        //     { new: true }
        // );

        await ticket.save();

        const publisher = new TicketUpdatedPublisher(natsInitializer.client);

        await publisher.publish({
            id: ticket.id,
            title: ticket.title,
            price: +ticket.price,
            userId: ticket.userId,
            version: ticket.version,
        });

        res.send(ticket);
    }
);

export { router as updateTicketRouter };

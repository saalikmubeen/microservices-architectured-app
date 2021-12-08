import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    requestValidationMiddleware,
} from "@microservices-node-react/common";

const router = express.Router();

import { Ticket } from "../models/Ticket";
import { natsInitializer } from "../natsInitializer";
import { TicketCreatedPublisher } from "../nats-events/publishers/TicketCreatedPublisher";

router.post(
    "/api/tickets",
    requireAuth,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0"),
    ],
    requestValidationMiddleware,
    async (req: Request, res: Response) => {
        const newTicket = await Ticket.createTicket({
            title: req.body.title,
            price: req.body.price,
            userId: req.currentUser!.id,
        });

        const publisher = new TicketCreatedPublisher(natsInitializer.client);

        await publisher.publish({
            id: newTicket.id,
            title: newTicket.title,
            price: Number(newTicket.price),
            userId: newTicket.userId,
            version: newTicket.version,
        });

        res.status(201).send(newTicket);
    }
);

export { router as createTicketRouter };

import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@microservices-node-react/common";

const router = express.Router();

import { Ticket } from "../models/Ticket";

router.get(
    "/api/tickets/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        const ticketId = req.params.id;

        const ticket = await Ticket.findOne({ where: { id: ticketId } });

        if (!ticket) {
            return next(new NotFoundError());
        }

        res.status(200).send(ticket);
    }
);

export { router as getTicketRouter };

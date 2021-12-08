import express, { Request, Response } from "express";

const router = express.Router();

import { Ticket } from "../models/Ticket";

router.get("/api/tickets", async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});

    res.status(200).send(tickets);
});

export { router as fetchTicketsRouter };

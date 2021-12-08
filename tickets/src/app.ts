import express, { Request, Response, NextFunction } from "express";
import session from "cookie-session";
import {
    NotFoundError,
    errorMiddleware,
    currentUser,
} from "@microservices-node-react/common";

const app = express();
app.use(express.json());

app.set("trust proxy", true);

app.use(
    session({
        signed: false,
        secure: process.env.NODE_ENV !== "test",
        secureProxy: true,
    })
);

app.use(currentUser);

import { createTicketRouter } from "./routes/createTicket";
import { fetchTicketsRouter } from "./routes/fetchTickets";
import { updateTicketRouter } from "./routes/updateTicket";
import { getTicketRouter } from "./routes/getTicket";

app.use(createTicketRouter);
app.use(fetchTicketsRouter);
app.use(updateTicketRouter);
app.use(getTicketRouter);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError());
    // when function is async, express can't catch the error and pass it to the error handling middleware. To make
    // express catch the error, we need to call next() with the error.

    // Instead to bypass this default this behavior, install express-async-errors package and import it at the top of the file:
    // import 'express';
    // import 'express-async-errors';
});

app.use(errorMiddleware);

export { app };

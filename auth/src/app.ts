import express from "express";
import session from "cookie-session";
// import { NotFoundError } from "./errors/NotFoundError";
// import { errorMiddleware } from "./middlewares/error-middleware";
import {
    NotFoundError,
    errorMiddleware,
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

import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signIn";
import { signOutRouter } from "./routes/signOut";
import { signUpRouter } from "./routes/signUp";

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async (req, res, next) => {
    next(new NotFoundError());
    // when function is async, express can't catch the error and pass it to the error handling middleware. To make
    // express catch the error, we need to call next() with the error.

    // Instead to bypass this default this behavior, install express-async-errors package and import it at the top of the file:
    // import 'express';
    // import 'express-async-errors';
});

app.use(errorMiddleware);

export { app };

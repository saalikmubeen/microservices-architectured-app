import mongoose from "mongoose";
import { app } from "./app";
import { ExpirationCompleteListener } from "./nats-events/listeners/ExpirationCompleteListener";
import { TicketCreatedListener } from "./nats-events/listeners/TicketCreatedListener";
import { TicketUpdatedListener } from "./nats-events/listeners/TicketUpdatedListener";
import { natsInitializer } from "./natsInitializer";

async function start() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined");
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL must be defined");
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined");
    }

    try {
        await natsInitializer.connect(
            process.env.NATS_CLUSTER_ID, // "ticketing"
            process.env.NATS_CLIENT_ID, //"abc123",
            process.env.NATS_URL // "http://nats-service:4222"
        );

        natsInitializer.client.on("close", () => {
            {
                console.log("NATS connection closed");
                process.exit();
            }
        });

        process.on("SIGTERM", natsInitializer.client.close);
        process.on("SIGINT", natsInitializer.client.close);

        new TicketCreatedListener(natsInitializer.client).listen();
        new TicketUpdatedListener(natsInitializer.client).listen();
        new ExpirationCompleteListener(natsInitializer.client).listen();
        new TicketCreatedListener(natsInitializer.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.......!");
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => {
        console.log("Listening on port 3000........!");
    });
}

start();

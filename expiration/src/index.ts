import { OrderCreatedListener } from "./nats-events/listeners/OrderCreatedLIstener";
import { natsInitializer } from "./natsInitializer";

async function start() {
    if (!process.env.REDIS_HOST) {
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

        new OrderCreatedListener(natsInitializer.client).listen();

        process.on("SIGTERM", natsInitializer.client.close);
        process.on("SIGINT", natsInitializer.client.close);
    } catch (err) {
        console.error(err);
    }
}

start();

import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
    /// clusterId(cid), clientId(client_id), server_url
    url: "http://localhost:4222",
});

stan.on("connect", () => {
    console.log("Listener connected to NATS");

    stan.on("close", () => {
        console.log("NATS connection closed!");
        process.exit();
    });

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName("accounting-service"); // giving identifier to the subscription

    const subscription = stan.subscribe(
        "ticket:created", // subject, name of the channel we want to subscribe/listen to
        "queue-group-name", // queue group   , durable queue group
        options
    );

    subscription.on("message", (msg: Message) => {
        const data = msg.getData();

        if (typeof data === "string") {
            console.log(
                `Received event #${msg.getSequence()}, with data: ${data}`
            );
        }

        msg.ack();
    });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

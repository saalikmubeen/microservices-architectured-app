import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/TicketCreatedListener";

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

    const listener = new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

// kubectl port-forward <pod_name> <port>:<port>

import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/TicketCreatedPublisher";

console.clear();

// stan = client
const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222",
});

stan.on("connect", async () => {
    console.log("Publisher connected to NATS");

    const publisher = new TicketCreatedPublisher(stan);

    try {
        await publisher.publish({
            id: "123",
            title: "concert",
            price: 20,
            userId: "123",
        });
    } catch (err) {
        console.log(err);
    }
});

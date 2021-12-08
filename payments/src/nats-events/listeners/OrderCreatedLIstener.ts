import { Message } from "node-nats-streaming";
import {
    Listener,
    Subjects,
    OrderCreatedEvent,
} from "@microservices-node-react/common";

import { Order } from "../../models/Order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = "payments-service";

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        console.log("OrderCreatedListener received data: ", data);

        const order = await Order.createOrder({
            id: data.id,
            status: data.status,
            userId: data.userId,
            price: data.ticket.price,
        });

        console.log(order);

        // acknowledge the message
        msg.ack();
    }
}

import {
    Subjects,
    Listener,
    ExpirationCompleteEvent,
    OrderStatus,
} from "@microservices-node-react/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/Order";
import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = "orders-service";

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        console.log("Expiration complete");
        const order = await Order.findById(data.orderId).populate("ticket");

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price,
            },
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
        });

        msg.ack();
    }
}

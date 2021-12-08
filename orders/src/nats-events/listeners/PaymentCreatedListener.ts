import {
    Listener,
    OrderStatus,
    Subjects,
    PaymentCreatedEvent,
} from "@microservices-node-react/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/Order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = "orders-service";

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        order.status = OrderStatus.Complete;
        await order.save();

        msg.ack();
    }
}

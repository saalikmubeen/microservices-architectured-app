import { Message } from "node-nats-streaming";
import {
    Listener,
    OrderCancelledEvent,
    Subjects,
    OrderStatus,
} from "@microservices-node-react/common";
import { Order } from "../../models/Order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = "payments-service";

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        console.log("Order Cancelled Listener");

        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1,
        });

        if (!order) {
            throw new Error("Order not found");
        }

        order.set({ status: data.status });
        await order.save();

        console.log(OrderStatus.Cancelled, order.status);

        msg.ack();
    }
}

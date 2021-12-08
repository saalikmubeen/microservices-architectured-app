import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
    OrderCancelledEvent,
    OrderStatus,
} from "@microservices-node-react/common";
import { Order } from "../../../models/Order";
import { natsInitializer } from "../../../natsInitializer";
import { OrderCancelledListener } from "../OrderCancelledListener";

test("order status is set to cancelled", async () => {
    const order = await Order.createOrder({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
        userId: "asdasd",
    });

    const eventData: OrderCancelledEvent["data"] = {
        id: order.id,
        version: 1,
        status: OrderStatus.Cancelled,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: "ticket_id",
            price: 20,
        },
    };

    const listener = new OrderCancelledListener(natsInitializer.client);

    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    await listener.onMessage(eventData, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    expect(updatedOrder!.version).toEqual(1);

    expect(message.ack).toHaveBeenCalled();
});

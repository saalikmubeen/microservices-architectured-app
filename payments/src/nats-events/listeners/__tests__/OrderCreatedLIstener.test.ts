import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
    OrderCreatedEvent,
    OrderStatus,
} from "@microservices-node-react/common";
import { natsInitializer } from "../../../natsInitializer";
import { OrderCreatedListener } from "../OrderCreatedLIstener";
import { Order } from "../../../models/Order";

test("order is saved and acks the message", async () => {
    const orders = await Order.find({});

    expect(orders.length).toEqual(0);

    const eventData: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: "ticket_id",
            price: 20,
        },
    };

    const listener = new OrderCreatedListener(natsInitializer.client);

    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    await listener.onMessage(eventData, message);

    const ordersAfter = await Order.find({});

    expect(ordersAfter.length).toEqual(1);

    expect(message.ack).toHaveBeenCalled();
});

import mongoose from "mongoose";
import {
    OrderStatus,
    ExpirationCompleteEvent,
} from "@microservices-node-react/common";
import { Order } from "../../../models/Order";
import { Ticket } from "../../../models/Ticket";
import { ExpirationCompleteListener } from "../ExpirationCompleteListener";
import { natsInitializer } from "../../../natsInitializer";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const ticket = await Ticket.createTicket({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    const order = await Order.createOrder({
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: ticket,
    });

    return { ticket, order };
};

test("order doesn't get cancelled if order is already paid(complete) and order:cancelled event doesn't get called", async () => {
    const { order, ticket } = await setup();

    order.status = OrderStatus.Complete;
    await order.save();

    expect(order.status).toEqual(OrderStatus.Complete);

    const listener = new ExpirationCompleteListener(natsInitializer.client);

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);

    expect(msg.ack).toHaveBeenCalled();

    expect(natsInitializer.client.publish).not.toHaveBeenCalled();
});

test("order gets cancelled when expiration:complete listener is called", async () => {
    const { order, ticket } = await setup();

    expect(order.status).toEqual(OrderStatus.Created);

    const listener = new ExpirationCompleteListener(natsInitializer.client);

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

    expect(msg.ack).toHaveBeenCalled();

    expect(natsInitializer.client.publish).toHaveBeenCalled();
});

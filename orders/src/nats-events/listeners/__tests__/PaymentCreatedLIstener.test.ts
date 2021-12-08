import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import {
    OrderStatus,
    PaymentCreatedEvent,
} from "@microservices-node-react/common";
import { Ticket } from "../../../models/Ticket";
import { Order } from "../../../models/Order";
import { PaymentCreatedListener } from "../PaymentCreatedListener";
import { natsInitializer } from "../../../natsInitializer";

test("Order is marked as complete on payment:created event", async () => {
    const ticket = await Ticket.createTicket({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });
    const order = await Order.createOrder({
        expiresAt: new Date(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket: ticket,
    });

    const listener = new PaymentCreatedListener(natsInitializer.client);

    const eventData: PaymentCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        orderId: order.id,
        userId: order.userId,
        chargeId: "stripe_charge_id",
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    await listener.onMessage(eventData, msg);

    expect(msg.ack).toHaveBeenCalled();

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
    OrderCancelledEvent,
    OrderStatus,
} from "@microservices-node-react/common";
import { Ticket } from "../../../models/Ticket";
import { natsInitializer } from "../../../natsInitializer";
import { OrderCancelledListener } from "../OrderCancelledListener";

test("orderId is set to undefined, and TicketUpdated event gets published", async () => {
    const ticket = await Ticket.createTicket({
        title: "concert",
        price: "20",
        userId: new mongoose.Types.ObjectId().toHexString(),
    });

    const eventData: OrderCancelledEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Cancelled,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: ticket.id,
            price: +ticket.price,
        },
    };

    const listener = new OrderCancelledListener(natsInitializer.client);

    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    await listener.onMessage(eventData, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toBeNull();

    expect(message.ack).toHaveBeenCalled();

    expect(natsInitializer.client.publish).toHaveBeenCalled();

    // console.log((natsInitializer.client.publish as jest.Mock).mock.calls[0][1]);

    const ticketUpdatedData = JSON.parse(
        (natsInitializer.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(ticketUpdatedData.version).toEqual(ticket.version + 1);
});

import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
    OrderCreatedEvent,
    OrderStatus,
} from "@microservices-node-react/common";
import { Ticket } from "../../../models/Ticket";
import { natsInitializer } from "../../../natsInitializer";
import { OrderCreatedListener } from "../OrderCreatedLIstener";

test("orderId gets attached to the ticket, ticket gets locked and TicketUpdated event gets published", async () => {
    const ticket = await Ticket.createTicket({
        title: "concert",
        price: "20",
        userId: new mongoose.Types.ObjectId().toHexString(),
    });

    const eventData: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: ticket.id,
            price: +ticket.price,
        },
    };

    const listener = new OrderCreatedListener(natsInitializer.client);

    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    await listener.onMessage(eventData, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(eventData.id);

    expect(message.ack).toHaveBeenCalled();

    expect(natsInitializer.client.publish).toHaveBeenCalled();

    // console.log((natsInitializer.client.publish as jest.Mock).mock.calls[0][1]);

    const ticketUpdatedData = JSON.parse(
        (natsInitializer.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(ticketUpdatedData.orderId).toEqual(eventData.id);
});

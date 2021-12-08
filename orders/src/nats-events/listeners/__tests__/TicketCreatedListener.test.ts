import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { TicketCreatedListener } from "../TicketCreatedListener";
import { natsInitializer } from "../../../natsInitializer";

test("TicketCreatedListener listens to event and creates ticket successfully and ack function was called", async () => {
    const ticketData = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
    };

    const listener = new TicketCreatedListener(natsInitializer.client);

    // @ts-ignore
    const message: Message = { ack: jest.fn() };

    await listener.onMessage(ticketData, message);

    const ticket = await Ticket.findById(ticketData.id);

    expect(ticket!.title).toEqual(ticketData.title);
    expect(ticket!.price).toEqual(ticketData.price);
    expect(ticket!.version).toEqual(0);

    expect(message.ack).toHaveBeenCalled();
});

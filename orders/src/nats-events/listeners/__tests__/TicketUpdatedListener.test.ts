import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { natsInitializer } from "../../../natsInitializer";
import { TicketUpdatedListener } from "../TicketUpdatedListener";

test("TicketUpdatedListener listens to event and updates the ticket successfully and ack function is called", async () => {
    const newTicket = await Ticket.createTicket({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    const updatedTicketData = {
        id: newTicket.id,
        title: "concert 2.0",
        price: 19.67,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 1,
    };

    const listener = new TicketUpdatedListener(natsInitializer.client);

    // @ts-ignore
    const message: Message = { ack: jest.fn() };

    await listener.onMessage(updatedTicketData, message);

    const updatedTicket = await Ticket.findById(newTicket.id);

    expect(updatedTicket!.title).toEqual(updatedTicketData.title);
    expect(updatedTicket!.price).toEqual(updatedTicketData.price);
    expect(updatedTicket!.version).toEqual(updatedTicketData.version);

    expect(message.ack).toHaveBeenCalled();
});

test("ack function is not called and ticket is not updated if inconsistent version number is received, out of order events", async () => {
    const newTicket = await Ticket.createTicket({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    const updatedTicketData = {
        id: newTicket.id,
        title: "concert 2.0",
        price: 19.67,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 4,
    };

    const listener = new TicketUpdatedListener(natsInitializer.client);

    // @ts-ignore
    const message: Message = { ack: jest.fn() };

    try {
        await listener.onMessage(updatedTicketData, message);
    } catch (err) {
        console.log(err);
    }

    const ticket = await Ticket.findById(newTicket.id);

    expect(ticket!.title).toEqual(newTicket.title);
    expect(ticket!.price).toEqual(newTicket.price);
    expect(ticket!.version).toEqual(newTicket.version);

    expect(message.ack).not.toHaveBeenCalled();
});

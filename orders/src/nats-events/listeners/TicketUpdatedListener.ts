import {
    Listener,
    Subjects,
    TicketUpdatedEvent,
} from "@microservices-node-react/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = "orders-service";

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findOne({
            _id: data.id,
            version: data.version - 1,
        });

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        ticket.set({
            title: data.title,
            price: data.price,
        });

        await ticket.save();

        msg.ack();
    }
}

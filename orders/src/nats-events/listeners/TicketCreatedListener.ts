import {
    Listener,
    Subjects,
    TicketCreatedEvent,
} from "@microservices-node-react/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = "orders-service";

    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.createTicket({
            id: data.id,
            price: data.price,
            title: data.title,
        });

        msg.ack();
    }
}

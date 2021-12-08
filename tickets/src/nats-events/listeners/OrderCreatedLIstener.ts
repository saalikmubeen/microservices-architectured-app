import { Message } from "node-nats-streaming";
import {
    Listener,
    Subjects,
    OrderCreatedEvent,
} from "@microservices-node-react/common";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = "tickets-service";

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        console.log("OrderCreatedListener received data: ", data);

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // reserving/locking the ticket
        ticket.orderId = data.id;
        await ticket.save();

        console.log("orderId attached to the ticket");

        // to let other services know that the ticket has been updated to avoid version conflicts
        const publisher = new TicketUpdatedPublisher(this.client);

        await publisher.publish({
            id: ticket.id,
            price: +ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId,
        });

        // acknowledge the message
        msg.ack();
    }
}

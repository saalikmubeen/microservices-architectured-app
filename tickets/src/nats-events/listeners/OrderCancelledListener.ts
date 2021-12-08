import { Message } from "node-nats-streaming";
import {
    Listener,
    OrderCancelledEvent,
    Subjects,
} from "@microservices-node-react/common";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = "tickets-service";

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        console.log("Order Cancelled Listener");
        console.log(data);

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        ticket.set({ orderId: null });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: +ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        });

        msg.ack();
    }
}

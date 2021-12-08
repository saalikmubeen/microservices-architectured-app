import { Message } from "node-nats-streaming";
import { Listener } from "./Listener";
import { Subjects } from "./subjects";
import { TicketUpdatedEvent } from "./TicketUpdatedEvent";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = "payments-service";

    onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        console.log("Event data!", data);

        msg.ack();
    }
}

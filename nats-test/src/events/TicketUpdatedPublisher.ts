import { Publisher } from "./Publisher";
import { Subjects } from "./subjects";
import { TicketUpdatedEvent } from "./TicketUpdatedEvent";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

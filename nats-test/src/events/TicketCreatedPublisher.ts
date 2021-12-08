import { Publisher } from "./Publisher";
import { TicketCreatedEvent } from "./TicketCreatedEvent";
import { Subjects } from "./subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

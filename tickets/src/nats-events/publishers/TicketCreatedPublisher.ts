import {
    Publisher,
    TicketCreatedEvent,
    Subjects,
} from "@microservices-node-react/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

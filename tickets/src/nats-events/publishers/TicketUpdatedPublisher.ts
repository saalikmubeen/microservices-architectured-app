import {
    Publisher,
    TicketUpdatedEvent,
    Subjects,
} from "@microservices-node-react/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

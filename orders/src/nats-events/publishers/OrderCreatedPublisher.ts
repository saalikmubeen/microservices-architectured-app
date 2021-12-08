import {
    Publisher,
    OrderCreatedEvent,
    Subjects,
} from "@microservices-node-react/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

import {
    Publisher,
    OrderCancelledEvent,
    Subjects,
} from "@microservices-node-react/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

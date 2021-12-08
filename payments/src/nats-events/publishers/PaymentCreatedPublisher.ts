import {
    Publisher,
    PaymentCreatedEvent,
    Subjects,
} from "@microservices-node-react/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

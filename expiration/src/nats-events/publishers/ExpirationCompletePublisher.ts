import {
    Publisher,
    Subjects,
    ExpirationCompleteEvent,
} from "@microservices-node-react/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

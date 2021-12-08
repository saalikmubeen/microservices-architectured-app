import { Subjects } from "./subjects";

export interface PaymentCreatedEvent {
    subject: Subjects.PaymentCreated;
    data: {
        id: string;
        orderId: string;
        chargeId: string;
        userId: string;
    };
}

import { Subjects } from "./subjects";
import { OrderStatus } from "./types/OrderStatus";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        status: OrderStatus;
        userId: string;
        expiresAt: string;
        version: number;
        ticket: {
            id: string;
            price: number;
        };
    };
}

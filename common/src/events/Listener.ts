import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: Subjects;
    abstract queueGroupName: string;
    abstract onMessage(data: T["data"], msg: Message): void;
    protected ackWait = 5 * 1000;

    constructor(protected client: Stan) {}

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on("message", (msg: Message) => {
            const data = this.parseMessage(msg);

            console.log(
                `Message received: ${this.subject} / ${
                    this.queueGroupName
                } / ${msg.getData()}`
            );

            this.onMessage(data, msg);
        });
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDeliverAllAvailable()
            .setDurableName(this.queueGroupName);
    }

    parseMessage(msg: Message): T["data"] {
        const data = msg.getData();
        return typeof data === "string"
            ? JSON.parse(data)
            : JSON.parse(data.toString("utf8"));
    }
}

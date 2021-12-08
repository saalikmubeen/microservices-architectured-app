import Bull from "bull";
import { ExpirationCompletePublisher } from "../nats-events/publishers/ExpirationCompletePublisher";
import { natsInitializer } from "../natsInitializer";

interface Payload {
    orderId: string;
}

const expirationQueue = new Bull<Payload>("expiration-queue", {
    redis: {
        host: process.env.REDIS_HOST,
    },
});

expirationQueue.process(async (job) => {
    console.log(job.data);

    await new ExpirationCompletePublisher(natsInitializer.client).publish({
        orderId: job.data.orderId,
    });
});

export { expirationQueue };

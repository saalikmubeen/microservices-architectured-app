import { Subjects } from "@microservices-node-react/common";

const natsInitializer = {
    client: {
        publish: jest
            .fn()
            .mockImplementation(
                (subject: Subjects, data: string, callback: any) => callback()
            ),
    },
};

export { natsInitializer };

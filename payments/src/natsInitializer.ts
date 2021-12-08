import nats, { Stan } from "node-nats-streaming";

class NatsInitializer {
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error("Cannot access NATS client before connecting");
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, {
            url,
        });

        return new Promise((resolve, reject) => {
            this.client.on("connect", () => {
                console.log("Connected to NATS");
                resolve("Connected to NATS");
            });
            this.client!.on("error", (err) => {
                reject(err);
            });
        });
    }
}

const natsInitializer = new NatsInitializer();

export { natsInitializer };

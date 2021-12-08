import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../app";

// global.d.ts
declare global {
    function signIn(id?: string): string[];
}

let mongo: any;

jest.mock("../natsInitializer.ts");
jest.mock("../stripe.ts");

beforeAll(async () => {
    process.env.JWT_SECRET = "secret";
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    mongo.stop();
    await mongoose.connection.close();
});

global.signIn = (id?: string) => {
    const email = "email@gmail.com";
    const _id = new mongoose.Types.ObjectId().toHexString();

    const payload = { email, id: id || _id };

    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    const session = { jwt: token };

    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString("base64");

    const cookie = [`express:sess=${base64}`];

    return cookie;
};

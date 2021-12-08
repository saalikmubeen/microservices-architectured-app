import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import { signInRouter } from "../routes/signIn";

// declare global {
//     namespace NodeJS {
//         interface Global {
//             signIn(): Promise<string[]>;
//         }
//     }
// }

// global.d.ts
declare global {
    function signIn(): Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
    process.env.JWT_SECRET = "secret";
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    mongo.stop();
    await mongoose.connection.close();
});

global.signIn = async () => {
    const email = "email@gmail.com";
    const password = "password";

    const res = await request(app)
        .post("/api/users/signUp")
        .send({ email, password })
        .expect(201);

    const cookie = res.get("Set-Cookie");
    return cookie;
};

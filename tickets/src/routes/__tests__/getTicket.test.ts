import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

const createTicket = async () => {
    const cookie = global.signIn();
    return request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "test", price: 20 })
        .expect(201);
};

test("Returns with a status code of 404, ticket not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .get(`/api/tickets/${id}`)
        .send({})
        .expect(404);
});

test("Returns the ticket and with a status code of 200", async () => {
    const res = await createTicket();

    const response = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send({})
        .expect(200);

    expect(response.body.title).toEqual(res.body.title);
    expect(response.body.price).toEqual(res.body.price);
});

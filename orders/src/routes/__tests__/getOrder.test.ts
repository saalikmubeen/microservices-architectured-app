import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

const createTicket = async () => {
    const ticket = await Ticket.createTicket({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });
    return ticket;
};

test("Returns 401 if user is not signed in", async () => {
    const response = await request(app)
        .get(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
        .send({})
        .expect(401);
});

test("Returns with a status code of 404, ticket not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signIn();

    const response = await request(app)
        .get(`/api/orders/${id}`)
        .set("Cookie", cookie)
        .send({})
        .expect(404);
});

test("Returns the order with a status code of 200", async () => {
    const ticket = await createTicket();
    const cookie = global.signIn();

    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({ ticketId: ticket.id })
        .expect(201);

    const res = await request(app)
        .get(`/api/orders/${response.body.id}`)
        .set("Cookie", cookie)
        .send({})
        .expect(200);

    expect(response.body.title).toEqual(res.body.title);
    expect(response.body.price).toEqual(res.body.price);
});

test("Returns the order with a status code of 401 if user doesn't belong to the order", async () => {
    const ticket = await createTicket();
    const cookie = global.signIn();

    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .get(`/api/orders/${response.body.id}`)
        .set("Cookie", global.signIn())
        .send({})
        .expect(401);
});

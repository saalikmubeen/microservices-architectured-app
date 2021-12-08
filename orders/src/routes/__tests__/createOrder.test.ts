import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/Order";
import { Ticket } from "../../models/Ticket";
import { natsInitializer } from "../../natsInitializer";

const createTicket = async () => {
    const ticket = await Ticket.createTicket({
        price: 20,
        title: "concert",
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    return ticket;
};

test("Returns 401 if user is not signed in", async () => {
    const response = await request(app)
        .post("/api/orders")
        .send({})
        .expect(401);
});

test("Returns status of other than 401 if user is signed in", async () => {
    const cookie = global.signIn();
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

test("Returns 400 if invalid ticketId is provided", async () => {
    const cookie = global.signIn();
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: "123",
        })
        .expect(400);
});

test("Returns 404 if ticket is not found", async () => {
    const cookie = global.signIn();
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

test("Returns 201 if ticket is successfully created", async () => {
    let orders = (await Order.find({})).length;
    expect(orders).toEqual(0);

    const ticket = await createTicket();

    const cookie = global.signIn();
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    orders = (await Order.find({})).length;
    expect(orders).toEqual(1);
});

test("Returns 400 if ticket is already reserved", async () => {
    let orders = (await Order.find({})).length;
    expect(orders).toEqual(0);

    const ticket = await createTicket();

    const cookie = global.signIn();
    await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    orders = (await Order.find({})).length;
    expect(orders).toEqual(1);

    const cookie2 = global.signIn();
    await request(app)
        .post("/api/orders")
        .set("Cookie", cookie2)
        .send({
            ticketId: ticket.id,
        })
        .expect(400);

    orders = (await Order.find({})).length;
    expect(orders).toEqual(1);
});

test("emits a order created event", async () => {
    const ticket = await Ticket.createTicket({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    const user = global.signIn();
    // make a request to create an order
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsInitializer.client.publish).toHaveBeenCalled();
});

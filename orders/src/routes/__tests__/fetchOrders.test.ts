import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/Order";
import { Ticket } from "../../models/Ticket";

const createTicket = async () => {
    const ticket = await Ticket.createTicket({
        price: 20,
        title: "concert",
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    return ticket;
};

const createOrder = async (ticketId: string, cookie: string[]) => {
    await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({ ticketId })
        .expect(201);
};

test("Returns 401 if user is not authorized", async () => {
    await request(app).get("/api/orders").send({}).expect(401);
});

test("Fetches all tickets only of logged in user successfully", async () => {
    const ticketOne = await createTicket();
    const ticketTwo = await createTicket();
    const ticketThree = await createTicket();

    const cookie = global.signIn();
    const cookie2 = global.signIn();

    await createOrder(ticketOne.id, cookie);
    await createOrder(ticketTwo.id, cookie);
    await createOrder(ticketThree.id, cookie2);

    const response = await request(app)
        .get("/api/orders")
        .set("Cookie", cookie)
        .send()
        .expect(200);

    const totalOrders = await Order.find({});

    expect(response.body.length).toEqual(2);
    expect(totalOrders.length).toEqual(3);

    // expect(response.body[0].id).toEqual(ticketOne.id);
    // expect(response.body[1].id).toEqual(ticketTwo.id);
});

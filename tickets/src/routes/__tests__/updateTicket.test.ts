import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import { natsInitializer } from "../../natsInitializer";

const createTicket = async () => {
    const cookie = global.signIn();
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "test", price: 20 })
        .expect(201);

    return { cookie, res };
};

test("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signIn())
        .send({
            title: "test",
            price: 20,
        })
        .expect(404);
});

test("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "test",
            price: 20,
        })
        .expect(401);
});

test("returns a 401 if the user does not own the ticket", async () => {
    const { res } = await createTicket();

    const response = await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", global.signIn())
        .send({
            title: "test",
            price: 20,
        })
        .expect(401);
});

test("Returns with a status code of 400, unable to update ticket if user is authorized but invalid body is provided", async () => {
    const { res, cookie } = await createTicket();

    const response = await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 20,
        })
        .expect(400);
});

test("Returns with a status code of 200, and successfully updates the ticket", async () => {
    const { res, cookie } = await createTicket();

    const response = await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "new title",
            price: 10,
        })
        .expect(200);

    expect(response.body.title).toEqual("new title");
    expect(response.body.price).toEqual("10");
});

test("Publishes an event when ticket is successfully updated", async () => {
    const { res, cookie } = await createTicket();

    const response = await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "new title",
            price: 10,
        })
        .expect(200);

    expect(response.body.title).toEqual("new title");
    expect(response.body.price).toEqual("10");

    expect(natsInitializer.client.publish).toHaveBeenCalled();
});

test("Returns with a status code of 400, unable to update ticket is already reserved, i.e, attached to an order ", async () => {
    const { res, cookie } = await createTicket();

    const ticket = await Ticket.findById(res.body.id);

    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "concert 2.0",
            price: 20,
        })
        .expect(400);
});

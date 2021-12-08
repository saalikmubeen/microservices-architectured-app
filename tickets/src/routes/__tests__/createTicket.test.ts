import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import { natsInitializer } from "../../natsInitializer";

test("Returns 401 if user is not signed in", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({})
        .expect(401);
});

test("Returns status of other than 401 if user is signed in", async () => {
    const cookie = global.signIn();
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

test("Returns 400 if invalid body is provided", async () => {
    const cookie = global.signIn();
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 10,
        })
        .expect(400);
});

test("Ticket is created if valid body is provided", async () => {
    let tickets = (await Ticket.find({})).length;
    expect(tickets).toEqual(0);

    const cookie = global.signIn();
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "Music Concert",
            price: 10,
        })
        .expect(201);

    tickets = (await Ticket.find({})).length;
    expect(tickets).toEqual(1);
});

test("Event is published when ticket is created", async () => {
    let tickets = (await Ticket.find({})).length;
    expect(tickets).toEqual(0);

    const cookie = global.signIn();
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "Music Concert",
            price: 10,
        })
        .expect(201);

    tickets = (await Ticket.find({})).length;
    expect(tickets).toEqual(1);

    // console.log(natsInitializer);

    expect(natsInitializer.client.publish).toHaveBeenCalled();
});

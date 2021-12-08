import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

const createTicket = async () => {
    const cookie = global.signIn();
    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "test", price: 20 })
        .expect(201);
};

test("Fetches all tickets successfully", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get("/api/tickets")
        .send({})
        .expect(200);

    expect(response.body.length).toEqual(3);
});

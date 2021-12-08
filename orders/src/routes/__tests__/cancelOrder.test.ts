import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import { Order, OrderStatus } from "../../models/Order";
import { natsInitializer } from "../../natsInitializer";

test("marks an order as cancelled", async () => {
    // create a ticket with Ticket Model
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

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);

    // expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

test("Return 401 if order doesn't belong to logged in user", async () => {
    // create a ticket with Ticket Model
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

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", global.signIn())
        .send()
        .expect(401);

    // expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Created);
});

test("emits a order cancelled event", async () => {
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

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);

    expect(natsInitializer.client.publish).toHaveBeenCalled();
});

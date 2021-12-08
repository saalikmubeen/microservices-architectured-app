import mongoose from "mongoose";
import supertest from "supertest";
import { OrderStatus } from "@microservices-node-react/common";
import { Order } from "../../models/Order";
import { app } from "../../app";
import { stripe } from "../../stripe";
import { Payment } from "../../models/Payment";
import { natsInitializer } from "../../natsInitializer";

test("throws 401 not authorized error if currentUser is not the same as order owner", async () => {
    const order = await Order.createOrder({
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    await supertest(app)
        .post("/api/payments")
        .set("Cookie", global.signIn())
        .send({
            orderId: order.id,
            token: "token",
        })
        .expect(401);
});

test("throws 400 bad request error order has been cancelled already", async () => {
    const order = await Order.createOrder({
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Cancelled,
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    await supertest(app)
        .post("/api/payments")
        .set("Cookie", global.signIn(order.userId))
        .send({
            orderId: order.id,
            token: "token",
        })
        .expect(400);
});

test("payment is successfully made and payment is stored in the database and payment:created event is published", async () => {
    const order = await Order.createOrder({
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    const response = await supertest(app)
        .post("/api/payments")
        .set("Cookie", global.signIn(order.userId))
        .send({
            orderId: order.id,
            token: "tok_visa",
        })
        .expect(201);

    expect(response.body.payment.orderId).toEqual(order.id);
    expect(stripe.charges.create).toHaveBeenCalled();

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual("tok_visa");
    expect(chargeOptions.amount).toEqual(order.price * 100);

    const payment = await Payment.findById(response.body.payment.id);

    expect(payment?.orderId).toEqual(order.id);
    expect(payment?.userId).toEqual(order.userId);

    expect(natsInitializer.client.publish).toHaveBeenCalled();
});

import request from "supertest";
import { app } from "../../app";

test("Fails when invalid email is provided", async () => {
    const response = await request(app)
        .post("/api/users/signIn")
        .send({
            email: "email@gmail.com",
            password: "password",
        })
        .expect("Content-Type", /json/)
        .expect(400);
});

test("Successful signIn", async () => {
    await request(app)
        .post("/api/users/signUp")
        .send({
            email: "email@gmail.com",
            password: "password",
        })
        .expect("Content-Type", /json/)
        .expect(201);

    const response = await request(app)
        .post("/api/users/signIn")
        .send({
            email: "email@gmail.com",
            password: "password",
        })
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body.email).toEqual("email@gmail.com");
    expect(response.get("Set-Cookie")).toBeDefined();
});

test("Wrong Password", async () => {
    await request(app)
        .post("/api/users/signUp")
        .send({
            email: "email@gmail.com",
            password: "password",
        })
        .expect("Content-Type", /json/)
        .expect(201);

    const response = await request(app)
        .post("/api/users/signIn")
        .send({
            email: "email@gmail.com",
            password: "password123",
        })
        .expect("Content-Type", /json/)
        .expect(400);
});

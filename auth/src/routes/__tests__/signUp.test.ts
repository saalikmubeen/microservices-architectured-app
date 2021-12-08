import request from "supertest";
import { app } from "../../app";

test("Should sign up a new user with a status code of 201", async () => {
    const response = await request(app)
        .post("/api/users/signUp")
        .send({
            email: "email@gmail.com",
            password: "password",
        })
        .expect("Content-Type", /json/)
        .expect(201);

    expect(response.body.email).toEqual("email@gmail.com");
    expect(response.get("Set-Cookie")).toBeDefined();
});

test("Testing invalid an email with a status code of 400", async () => {
    const response = await request(app)
        .post("/api/users/signUp")
        .send({
            email: "email",
            password: "password",
        })
        .expect("Content-Type", /json/)
        .expect(400);
});

test("Testing invalid an password with a status code of 400", async () => {
    const response = await request(app)
        .post("/api/users/signUp")
        .send({
            email: "email@gmail.com",
            password: "pass",
        })
        .expect("Content-Type", /json/)
        .expect(400);
});

test("Testing duplicate emails", async () => {
    await request(app)
        .post("/api/users/signUp")
        .send({
            email: "email@gmail.com",
            password: "password",
        })
        .expect("Content-Type", /json/)
        .expect(201);

    await request(app)
        .post("/api/users/signUp")
        .send({
            email: "email@gmail.com",
            password: "password",
        })
        .expect("Content-Type", /json/)
        .expect(400);
});

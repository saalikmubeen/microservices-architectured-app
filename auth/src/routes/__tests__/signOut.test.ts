import request from "supertest";
import { app } from "../../app";

test("Successful signOut", async () => {
    await request(app)
        .post("/api/users/signUp")
        .send({
            email: "email@gmail.com",
            password: "password",
        })
        .expect("Content-Type", /json/)
        .expect(201);

    const response = await request(app)
        .post("/api/users/signOut")
        .expect("Content-Type", /json/);

    expect(response.body.currentUser).toBe(null);
    // expect(response.get("Set-Cookie")).toBeDefined();
});

import request from "supertest";
import { app } from "../../app";

test("Get currently loggedIn user", async () => {
    // const res = await request(app)
    //     .post("/api/users/signUp")
    //     .send({
    //         email: "email@gmail.com",
    //         password: "password",
    //     })
    //     .expect("Content-Type", /json/)
    //     .expect(201);

    // const cookie = res.get("Set-Cookie");

    const cookie = await global.signIn();

    const response = await request(app)
        .get("/api/users/currentUser")
        .set("Cookie", cookie)
        .send()
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body.currentUser.email).toEqual("email@gmail.com");
});

test("Get currentUer=null if not logged In", async function () {
    const response = await request(app)
        .get("/api/users/currentUser")
        .send()
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
});

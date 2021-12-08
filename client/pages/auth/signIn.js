import { useState } from "react";
import { useRouter } from "next/router";
import useRequest from "../../hooks/useRequest";

export default () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { sendRequest, errors } = useRequest({
        url: "/api/users/signIn",
        method: "post",
        body: { email, password },
        onSuccess: () => {
            router.push("/");
        },
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        await sendRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign In</button>
        </form>
    );
};

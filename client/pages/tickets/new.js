import React, { useState } from "react";
import { useRouter } from "next/router";
import useRequest from "../../hooks/useRequest";

const CreateTicket = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    const { sendRequest, errors } = useRequest({
        body: { title, price },
        url: "/api/tickets",
        method: "post",
        onSuccess: () => {
            router.push("/");
        },
    });

    const onBlur = () => {
        const priceFloat = parseFloat(price);

        if (isNaN(priceFloat)) {
            return setPrice("");
        }

        setPrice(priceFloat.toFixed(2));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        await sendRequest();
    };

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        value={price}
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form-control"
                    />
                </div>
                {errors}
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default CreateTicket;

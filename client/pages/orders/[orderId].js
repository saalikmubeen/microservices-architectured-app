import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
import client from "../../buildClient";

const Order = ({ order, currentUser }) => {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(0);

    const { sendRequest, errors } = useRequest({
        body: {
            orderId: order.id,
        },
        method: "post",
        url: "/api/payments",
        onSuccess: (data) => {
            console.log(data);
            router.push("/orders");
        },
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    if (timeLeft < 0) {
        return <h1>Time to purchase the ticket expired. Try again</h1>;
    }

    return (
        <div>
            Time left to pay: {timeLeft} seconds
            <h3>Order Details: </h3>
            <p>
                <em> OrderId: </em> {order.id}
            </p>
            <p>
                <em> Ticket: </em> {order.ticket.title} for Rs
                {order.ticket.price}
            </p>
            <StripeCheckout
                token={({ id }) => sendRequest({ token: id })}
                stripeKey="pk_test_51H8hlaJw1IphkJ3MAWTSFrRAGHCMouXlpV9U7KBXZDucnorqLqqpaYmcFPlzSD7CRarJTvjkKcukzuKcCoqBOM2x00gncJONo0"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
};

export async function getServerSideProps(context) {
    const request = client(context.req);
    const res = await request.get(`/api/orders/${context.params.orderId}`);

    return {
        props: { order: res.data }, // will be passed to the page component as props
    };
}

export default Order;

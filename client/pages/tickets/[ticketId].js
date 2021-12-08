import React from "react";
import { useRouter } from "next/router";
import client from "../../buildClient";
import axios from "axios";
import useRequest from "../../hooks/useRequest";

const Ticket = ({ ticket }) => {
    const router = useRouter();

    const { errors, sendRequest } = useRequest({
        body: { ticketId: ticket.id },
        method: "post",
        url: "/api/orders",
        onSuccess: (data) => {
            router.push(`/orders/${data.id}`);
        },
    });
    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>Price: {ticket.price}</h4>
            <button className="btn btn-primary" onClick={() => sendRequest()}>
                Purchase
            </button>
            {errors}
        </div>
    );
};

export default Ticket;

export async function getServerSideProps(context) {
    const request = client(context.req);
    const res = await request.get(`/api/tickets/${context.params.ticketId}`);

    return {
        props: { ticket: res.data }, // will be passed to the page component as props
    };
}

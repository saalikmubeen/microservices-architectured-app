import React from "react";
import client from "../../buildClient";

const Orders = ({ orders }) => {
    return (
        <>
            <h1>Your Orders: </h1>
            <ul>
                {orders.map((order) => {
                    return (
                        <li key={order.id}>
                            {order.ticket.title}( Rs{order.ticket.price} ) -
                            {"  "}
                            {order.status}
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default Orders;

export async function getServerSideProps(context) {
    const request = client(context.req);
    const res = await request.get("/api/orders");

    return {
        props: { orders: res.data }, // will be passed to the page component as props
    };
}

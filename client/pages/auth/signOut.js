import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useRequest from "../../hooks/useRequest";

export default function signOut() {
    const router = useRouter();
    const { sendRequest } = useRequest({
        url: "/api/users/signOut",
        method: "post",
        body: {},
        onSuccess: () => {
            router.push("/");
        },
    });

    useEffect(() => {
        sendRequest();
    }, []);
    return <div style={{ textAlign: "center" }}>Signing you out...!</div>;
}

import { useState } from "react";
import axios from "axios";

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const sendRequest = async (props = {}) => {
        try {
            const res = await axios[method](url, { ...body, ...props });

            if (onSuccess) {
                setErrors(null);
                onSuccess(res.data);
            }

            return res.data;
        } catch (err) {
            const error = (
                <div className="alert alert-danger">
                    <h4>Ooops....</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map((err) => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );

            setErrors(error);
        }
    };

    return { errors, sendRequest };
};

export default useRequest;

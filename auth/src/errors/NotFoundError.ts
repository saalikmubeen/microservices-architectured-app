import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
    statusCode = 404;
    error = "Endpoint not found!";

    constructor() {
        super("Endpoint doesn't exist!");

        Object.setPrototypeOf(this, NotFoundError.prototype); // required because this class is extending a built-in class
    }

    serializeErrors() {
        return [
            {
                message: this.error,
            },
        ];
    }
}

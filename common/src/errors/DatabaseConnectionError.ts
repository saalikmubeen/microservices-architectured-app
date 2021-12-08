import { CustomError } from "./CustomError";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    error = "Something went wrong, Service temporarily unavailable!";

    constructor() {
        super("Error connecting to the database");

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype); // required because this class is extending a built-in class
    }

    serializeErrors() {
        return [
            {
                message: this.error,
            },
        ];
    }
}

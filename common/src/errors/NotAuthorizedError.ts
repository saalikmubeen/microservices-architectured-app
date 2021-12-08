import { CustomError } from "./CustomError";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super("Not Authorized");

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors() {
        return [{ message: "You are not authorized to perform this action!" }];
    }
}

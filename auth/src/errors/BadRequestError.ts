import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public error: string) {
        super(error);

        Object.setPrototypeOf(this, BadRequestError.prototype); // required because this class is extending a built-in class
    }

    serializeErrors() {
        return [
            {
                message: this.error,
            },
        ];
    }
}

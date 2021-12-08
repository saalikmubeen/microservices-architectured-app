export abstract class CustomError extends Error {
    // <-- abstract class
    abstract statusCode: number;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): { message: string; field?: string }[];
}

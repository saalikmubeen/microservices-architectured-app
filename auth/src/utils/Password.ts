import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
    static async hashPassword(password: string) {
        const salt = randomBytes(8).toString("hex");
        const buff = (await scryptAsync(password, salt, 64)) as Buffer; // hash

        return `${buff.toString("hex")}.${salt}`;
    }

    static async comparePassword(
        storedPassword: string,
        suppliedPassword: string
    ) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // hash
        return buff.toString("hex") === hashedPassword;
    }
}

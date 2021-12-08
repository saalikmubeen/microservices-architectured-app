import { Schema, model, Document, Model } from "mongoose";
import { Password } from "../utils/Password";

// 1. Interface that describes the attributes required for creating a user
interface UserAttrs {
    email: string;
    password: string;
}

// 2. Interface that describes the properties and methods that a User model has
interface UserModel extends Model<UserDoc> {
    createUser(attrs: UserAttrs): Promise<UserDoc>;
}

// 3. Interface that describes the properties that a User document has
interface UserDoc extends Document {
    email: string;
    password: string;
}

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

userSchema.statics.createUser = async function (attrs: UserAttrs) {
    const user = new User(attrs);
    return user.save();
};

userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        this.password = await Password.hashPassword(this.password);

        // Or
        // const hashedPassword = await Password.hashPassword(this.get("password"));
        // this.set("password", hashedPassword);
    }

    done();
});

const User = model<UserDoc, UserModel>("User", userSchema);

export { User };

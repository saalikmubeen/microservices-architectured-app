import { Schema, model, Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// 1. Interface that describes the attributes required for creating a user
interface TicketAttrs {
    title: string;
    price: string;
    userId: string;
}

// 2. Interface that describes the properties and methods that a User model has
interface TicketModel extends Model<TicketDoc> {
    createTicket(attrs: TicketAttrs): Promise<TicketDoc>;
}

// 3. Interface that describes the properties that a User document has
interface TicketDoc extends Document {
    title: string;
    price: string;
    userId: string;
    version: number;
    orderId?: string;
}

const ticketSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },

        userId: {
            type: String,
            required: true,
        },

        orderId: {
            type: String,
            required: false,
            default: null,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.createTicket = async function (attrs: TicketAttrs) {
    const ticket = new Ticket(attrs);
    return ticket.save();
};

const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

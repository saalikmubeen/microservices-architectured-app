import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
// import { Order, OrderStatus } from "./order";

interface TicketAttrs {
    title: string;
    price: number;
    id: string;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    // isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    createTicket(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.createTicket = async (attrs: TicketAttrs) => {
    const newTicket = new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });
    return await newTicket.save();
};

// ticketSchema.methods.isReserved = async function () {
//     // this === the ticket document that we just called 'isReserved' on
//     const existingOrder = await Order.findOne({
//         ticket: this,
//         status: {
//             $in: [
//                 OrderStatus.Created,
//                 OrderStatus.AwaitingPayment,
//                 OrderStatus.Complete,
//             ],
//         },
//     });

//     return !!existingOrder;
// };

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

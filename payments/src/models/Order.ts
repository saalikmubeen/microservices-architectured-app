import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@microservices-node-react/common";

export { OrderStatus };

interface OrderAttrs {
    id: string;
    userId: string;
    status: OrderStatus;
    price: number;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    createOrder(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        price: {
            type: Number,
            required: true,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.createOrder = async (attrs: OrderAttrs) => {
    const newOrder = new Order({
        _id: attrs.id,
        userId: attrs.userId,
        price: attrs.price,
        status: attrs.status,
    });
    return await newOrder.save();
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };

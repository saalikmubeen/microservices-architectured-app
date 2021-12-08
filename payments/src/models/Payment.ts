import mongoose from "mongoose";

interface PaymentAttrs {
    orderId: string;
    userId: string;
    chargeId: string;
}

interface PaymentDoc extends mongoose.Document {
    userId: string;
    orderId: string;
    chargeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    createPayment(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
            required: true,
        },
        chargeId: {
            type: String,
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

paymentSchema.statics.createPayment = async (attrs: PaymentAttrs) => {
    const newOrder = new Payment(attrs);
    return await newOrder.save();
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
    "Payment",
    paymentSchema
);

export { Payment };

import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    cartItems: [{
        product: {
            type: Types.ObjectId,
            ref: 'product'
        },
        quantity: Number,
        price: Number
    }],
    totalOrderPrice: Number,
    shippingAddress: {
        street: String,
        city: String,
        phone: String,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelevered: {
        type: Boolean,
        default: false
    },
    deleveredAt: Date

}, {
    timestamps: true
});



export const orderModel = model('order', orderSchema)
import { model, Schema, Types } from "mongoose";

const cartSchema = new Schema({
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
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number
        },
        totalProductDiscount: {
            type: Number
        }

    }],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    discount: Number

}, {
    timestamps: true
});



export const cartModel = model('cart', cartSchema)
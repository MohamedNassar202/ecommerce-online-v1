import dotenv from 'dotenv';
dotenv.config();
import { reviewModel } from "../../../../database/models/review.model.js"
import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { deleteOne } from "../../../handler/factor.js"
import { ApiFeature } from "../../../utils/apiFeatures.js"
import { cartModel } from "../../../../database/models/cart.model.js"
import { productModel } from "../../../../database/models/product.model.js"
import { orderModel } from "../../../../database/models/order.model .js"

import Stripe from 'stripe';
const stripe = new Stripe(process.env.SECRET_KEY_STRIPE);

const createCashOrder = catchError(
    async (req, res, next) => {
        //! get cart
        const cart = await cartModel.findById(req.params.id);
        //* get total price 
        const totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount
            : cart.totalPrice
        //^ create order
        const order = new orderModel({
            user: req.user._id,
            cartItems: cart.cartItems,
            totalOrderPrice,
            shippingAddress: req.body.shippingAddress,
        })
        await order.save()

        //& increment sold & decrement stock
        if (order) {
            let options = cart.cartItems.map(item => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { stock: -item.quantity, sold: item.quantity } }

                }
            }))
            await productModel.bulkWrite(options)

            //! remove user cart
            await cartModel.findByIdAndDelete(req.params.id)
            return res.json({ message: "success", order })
        }
        return next(new appError("Error in cart ID", 404))


    })
const getSpecificOrder = catchError(
    async (req, res, next) => {

        const order = await orderModel.findOne({ user: req.user._id }).populate('cartItems.product')
        return res.status(200).json({ message: "Done", order })
    })
const getAllOrders = catchError(
    async (req, res, next) => {
        const orders = await orderModel.find().populate('cartItems.product')
        return res.status(200).json({ message: "Done", orders })

    })

const createCheckOutSession = catchError(
    async (req, res, next) => {
        const cart = await cartModel.findById(req.params.id);
        const totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount
            : cart.totalPrice
        let session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'egp',
                        unit_amount: totalOrderPrice * 100,
                        product_data: {
                            name: req.user.name
                        }
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: "https://www.google.com/",
            cancel_url: "https://www.facebook.com/",
            customer_email: req.user.email,
            client_reference_id: req.params.id,
            metadata: req.body.shippingAddress
        })
        res.status(200).json({ message: "Done", session })

    })


export {
    createCashOrder,
    getSpecificOrder,
    getAllOrders,
    createCheckOutSession
}
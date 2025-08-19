import { reviewModel } from "../../../../database/models/review.model.js"
import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { deleteOne } from "../../../handler/factor.js"
import { ApiFeature } from "../../../utils/apiFeatures.js"
import { cartModel } from "../../../../database/models/cart.model.js"
import { productModel } from "../../../../database/models/product.model.js"
import { couponModel } from "../../../../database/models/coupon.model.js"

function calcTotalPrice(cart) {
    let totalPrice = 0;
    cart.cartItems.forEach(elm => totalPrice += elm.quantity * elm.price)
    cart.totalPrice = totalPrice
}

const addProductToCart = catchError(
    async (req, res, next) => {
        let product = await productModel.findById(req.body.product).select('price')
        if (!product) return next(new appError('product not found', 404))

        req.body.price = product.price
        let isCartExist = await cartModel.findOne({ user: req.user._id })
        if (!isCartExist) {
            let cart = new cartModel({
                user: req.user._id,
                cartItems: [req.body],
            })
            calcTotalPrice(cart)
            await cart.save()
            return res.status(201).json({ message: "Done", cart })
        }
        let item = isCartExist.cartItems.find(elm => elm.product == req.body.product)
        if (item) {
            item.quantity += req.body.quantity || 1
        } else {
            isCartExist.cartItems.push(req.body)
        }
        calcTotalPrice(isCartExist)
        if (isCartExist.discount) isCartExist.totalPriceAfterDiscount = isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100

        isCartExist.save()
        return res.status(201).json({ message: "add to cart", cart: isCartExist })

    })
const removeProductFromCart = catchError(
    async (req, res, next) => {
        const cart = await cartModel.findOne({ user: req.user._id })
        if (!cart) return next(new appError("Cart Not Found", 404));
        const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === req.params.id);

        if (itemIndex === -1) {
            return next(new appError("Item not found in cart", 404));
        }
        const updatedCart = await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { cartItems: { _id: req.params.id } } },
            { new: true }
        );
        calcTotalPrice(updatedCart)
        if (updatedCart.discount) {
            updatedCart.totalPriceAfterDiscount = updatedCart.totalPrice - (updatedCart.totalPrice * updatedCart.discount) / 100
        }
        await updatedCart.save()
        cart && res.status(200).json({ message: "Done", updatedCart })

    })
const updateQuantity = catchError(
    async (req, res, next) => {
        let product = await productModel.findById(req.params.id).select('price')
        if (!product) return next(new appError('product not found', 404))
        let isCartExist = await cartModel.findOne({ user: req.user._id })
        let item = isCartExist.cartItems.find(elm => elm.product == req.params.id)
        if (item) {
            item.quantity = req.body.quantity
        }
        calcTotalPrice(isCartExist)
        if (isCartExist.discount) isCartExist.totalPriceAfterDiscount = isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100

        await isCartExist.save()
        return res.status(201).json({ message: "Done", cart: isCartExist })

    })
const applyCoupon = catchError(
    async (req, res, next) => {
        let coupon = await couponModel.findOne({ code: req.body.code, expires: { $gt: Date.now() } })
        let cart = await cartModel.findOne({ user: req.user._id })
        if (cart && coupon) {
            cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100
            cart.discount = coupon.discount
            await cart.save()
            return res.status(201).json({ message: "Done", cart })
        }

    })

const getLoggedUserCart = catchError(
    async (req, res, next) => {
        const cart = await cartModel.findOne({ user: req.user._id }).populate('cartItems.product')
        if (cart == null) {
            return res.status(200).json({ message: "cart is empty", userCart: req.user._id })
        }
        return res.status(200).json({ message: "Done", cart })
    })
const clearUserCart = catchError(
    async (req, res, next) => {
        const cart = await cartModel.findOneAndDelete({ user: req.user._id,_id:req.params.id})
        return cart? res.status(200).json({ message: "Done", cart }):
        next(new appError("cart not found",404))
    })


export {
    addProductToCart,
    removeProductFromCart,
    updateQuantity,
    applyCoupon,
    getLoggedUserCart,
    clearUserCart

}
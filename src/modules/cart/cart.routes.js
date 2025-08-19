import { Router } from "express";
import * as cart from "./controller/cart.controller.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const cartRouter = Router()
cartRouter.route('/')
    .post(protectedRoutes, allowedTo('user'), cart.addProductToCart)
    .get(protectedRoutes, allowedTo('user'), cart.getLoggedUserCart)
    //     .get(cart.getAllCarts)

cartRouter.post('/applyCoupon', protectedRoutes, allowedTo('user'), cart.applyCoupon)

cartRouter.route('/:id')
    .patch(protectedRoutes, allowedTo('user'), cart.removeProductFromCart)
    .put(protectedRoutes, allowedTo('user'), cart.updateQuantity)
    .delete(protectedRoutes, allowedTo('user'),cart.clearUserCart)

//     .get(cart.getOnecCart)
//     .put(protectedRoutes, allowedTo('user'), cart.updateCart)



export default cartRouter
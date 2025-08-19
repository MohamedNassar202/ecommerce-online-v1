import { Router } from "express";
import * as wishlist from "./controller/wishlist.controller.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const wishlistRouter = Router()
wishlistRouter.route('/')
    .patch(protectedRoutes, allowedTo('user'), wishlist.addToWishlist)
    .delete(protectedRoutes, allowedTo('user'), wishlist.removeFromWishlist)
    .get(protectedRoutes, allowedTo('user'), wishlist.getAllWishlist)






export default wishlistRouter
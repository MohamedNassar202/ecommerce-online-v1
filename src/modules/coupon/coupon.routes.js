import { Router } from "express";
import * as coupon from "./controller/coupon.controller.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const couponRouter = Router()

couponRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), coupon.addCoupon)
     .get(protectedRoutes, allowedTo('admin'),coupon.getAllCoupons)
couponRouter.route('/:id')
    .get(protectedRoutes, allowedTo('user','admin'),coupon.getSpecificCoupon)
    .put(protectedRoutes, allowedTo('admin'), coupon.updateCoupon)
    .delete(protectedRoutes, allowedTo('admin'),coupon.deleteCoupon)



export default couponRouter
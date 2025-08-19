import { Router } from "express";
import * as order from "./controller/order.controller.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const orderRouter = Router()

orderRouter.route('/').
    get(protectedRoutes, allowedTo('user'), order.getSpecificOrder)

orderRouter.get('/all', protectedRoutes, allowedTo('admin'), order.getAllOrders)


orderRouter.route('/:id')
    .post(protectedRoutes, allowedTo('user'), order.createCashOrder)
    
orderRouter.post('/checkout/:id',protectedRoutes, allowedTo('user'), order.createCheckOutSession)




export default orderRouter 
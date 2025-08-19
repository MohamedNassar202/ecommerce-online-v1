import { Router } from "express";
import * as address from "./controller/address.controller.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const addressRouter = Router()
addressRouter.route('/')
    .patch(protectedRoutes, allowedTo('user'), address.addAddress)
    .delete(protectedRoutes, allowedTo('user'), address.removeAddress)
    .get(protectedRoutes, allowedTo('user'), address.getAllUserAddresses)




export default addressRouter
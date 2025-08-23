import { Router } from "express";
import * as user from "./controller/user.controller.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const userRouter = Router()

userRouter.route('/')
    .post(user.addUser)
    .get(protectedRoutes, allowedTo('admin'), user.getAllUsers)
userRouter.route('/:id')
    .put(user.updateUser)
    .patch(user.changeUserPassword)
    .delete(user.deleteUser)
    .get(user.getSpecificUser)

export default userRouter

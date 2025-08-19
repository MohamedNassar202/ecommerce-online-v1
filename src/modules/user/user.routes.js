import { Router } from "express";
import * as user from "./controller/user.controller.js";
const userRouter = Router()

userRouter.route('/')
    .post(user.addUser)
    .get(user.getAllUsers)
userRouter.route('/:id')
    .put(user.updateUser)
    .patch(user.changeUserPassword)
    .delete(user.deleteUser)
    .get(user.getSpecificUser)

export default userRouter
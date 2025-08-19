import { Router } from "express";
import * as auth from "./controller/auth.controller.js";
const authRouter = Router()

authRouter.route('/signup')
    .post(auth.signUp)
    authRouter.route('/signin')
    .post(auth.signIn)




export default authRouter
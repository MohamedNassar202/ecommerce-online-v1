import { Router } from "express";
import * as review from "./controller/review.controller.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const reviewRouter = Router()
reviewRouter.route('/')
    .post(protectedRoutes, allowedTo('user'), review.addReview)
    .get(review.getAllReviews)
reviewRouter.route('/:id')
    .get(review.getOneReview)
    .put(protectedRoutes, allowedTo('user'), review.updateReview)
    .delete(protectedRoutes, allowedTo('admin','user'), review.deleteReview)



export default reviewRouter
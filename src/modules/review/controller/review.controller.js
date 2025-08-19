import { reviewModel } from "../../../../database/models/review.model.js"
import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { deleteOne } from "../../../handler/factor.js"
import { ApiFeature } from "../../../utils/apiFeatures.js"


const addReview = catchError(
    async (req, res, next) => {
        req.body.user = req.user._id
        const isReview = await reviewModel.findOne({ user: req.user._id, product: req.body.product })
        if (isReview) return next(new appError('you already added a review for this product before', 409))
        const review = new reviewModel(req.body)
        await review.save()
        return res.status(201).json({ message: "Done", review })
    })

const getAllReviews = catchError(
    async (req, res, next) => {

        let apiFeature = new ApiFeature(reviewModel.find(), req.query).
            paginate().sort().search().fields().filter()

        const allReviews = await apiFeature.mongooseQuery

        return res.status(200).json({ message: "Done", page: apiFeature.PAGE_NUMBER, allReviews })
    })
const getOneReview = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const review = await reviewModel.findById(id)

        return review ? res.status(200).json({ message: "Done", review }) :
            next(new appError("review not found", 404))
    })

const updateReview = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const review = await reviewModel.findOneAndUpdate({ _id: id, user: req.user._id },req.body, { new: true })

        return review ? res.status(200).json({ message: "Done", review }) :
            next(new appError("Review Not Found or You Are Not Authorized to perform this action", 404))
    })

const deleteReview = deleteOne(reviewModel, "review")


export {
    addReview,
    getAllReviews,
    getOneReview,
    updateReview,
    deleteReview
}
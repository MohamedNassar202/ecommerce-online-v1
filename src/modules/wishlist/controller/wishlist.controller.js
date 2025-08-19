import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { userModel } from "../../../../database/models/user.model.js"



const addToWishlist = catchError(
    async (req, res, next) => {
        const { product } = req.body
        const wishlist = await userModel.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: product } }, { new: true })

        return wishlist ? res.status(200).json({ message: "Done", wishlist: wishlist.wishlist }) :
            next(new appError("wishList Not Found ", 404))
    })
const removeFromWishlist = catchError(
    async (req, res, next) => {
        const { product } = req.body
        const wishlist = await userModel.findByIdAndUpdate(req.user._id, { $pull: { wishlist: product } }, { new: true })

        return wishlist ? res.status(200).json({ message: "Done", wishlist: wishlist.wishlist }) :
            next(new appError("wishList Not Found ", 404))
    })
const getAllWishlist = catchError(
    async (req, res, next) => {
        const wishlist = await userModel.findOne({ _id: req.user._id }).populate('wishlist')

        return wishlist ? res.status(200).json({ message: "Done", wishlist: wishlist.wishlist }) :
            next(new appError("wishList Not Found ", 404))
    })



export {
    addToWishlist,
    removeFromWishlist,
    getAllWishlist
}
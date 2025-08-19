import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { userModel } from "../../../../database/models/user.model.js"



const addAddress = catchError(
    async (req, res, next) => {
        const result = await userModel.findByIdAndUpdate(req.user._id, { $addToSet: { addresses: req.body } }, { new: true })
        return result ? res.status(200).json({ message: "Done", result: result.addresses }) :
            next(new appError("Address Not Found ", 404))
    })
const removeAddress = catchError(
    async (req, res, next) => {
        const result = await userModel.findByIdAndUpdate(req.user._id, { $pull: { addresses: { _id: req.body.address } } }, { new: true })

        return result ? res.status(200).json({ message: "Done", result: result.addresses }) :
            next(new appError("Address Not Found ", 404))
    })
const getAllUserAddresses = catchError(
    async (req, res, next) => {
        const result = await userModel.findOne({ _id: req.user._id }).populate('addresses')

        return result ? res.status(200).json({ message: "Done", result: result.addresses }) :
            next(new appError("Address Not Found ", 404))
    })



export {
    addAddress,
    removeAddress,
    getAllUserAddresses
}
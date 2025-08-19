import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { deleteOne } from "../../../handler/factor.js"
import { ApiFeature } from "../../../utils/apiFeatures.js"
import { userModel } from "../../../../database/models/user.model.js"
import bcrypt from 'bcrypt';


const addUser = catchError(
    async (req, res, next) => {
        const user = new userModel(req.body)
        await user.save()
        return res.status(201).json({ message: "Done", user })
    })

const getAllUsers = catchError(
    async (req, res, next) => {
        let apiFeature = new ApiFeature(userModel.find(), req.query).
            paginate().sort().search().fields().filter()

        const allUsers = await apiFeature.mongooseQuery

        return res.status(200).json({ message: "Done", page: apiFeature.PAGE_NUMBER, allUsers })
    })
const getSpecificUser = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const specificUser = await userModel.findById(id)
        return specificUser ? res.status(200).json({ message: "Done", specificUser }) :
            next(new appError("user Not Found", 404))
    })

const updateUser = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const user = await userModel.findByIdAndUpdate(id, req.body, { new: true })

        return user ? res.status(200).json({ message: "Done", user }) :
            next(new appError("user Not Found", 404))
    })

const changeUserPassword = catchError(
    async (req, res, next) => {
        const { id } = req.params
        req.body.passwordChangedAt = Date.now()
        const user = await userModel.findByIdAndUpdate(id, req.body, { new: true })

        return user ? res.status(200).json({ message: "Done", user }) :
            next(new appError("user Not Found", 404))
    })
const deleteUser = deleteOne(userModel, "user")


export {
    addUser,
    getAllUsers,
    getSpecificUser,
    updateUser,
    changeUserPassword,
    deleteUser
}
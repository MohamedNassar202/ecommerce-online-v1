import { userModel } from "../../../../database/models/user.model.js"
import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'




const signUp = catchError(
    async (req, res, next) => {
        const { name, email, password } = req.body
        let isExists = await userModel.findOne({ email })
        if (isExists) return next(new appError('account already exists', 409))
        const user = new userModel(req.body)
        await user.save()
        let token = jwt.sign({ name: user.name, email: user.email, id: user._id, role: user.role }, process.env.SECRET_KEY_TOKEN)
        return res.status(201).json({ message: "Done", token })
    })
const signIn = catchError(
    async (req, res, next) => {
        const { email, password } = req.body
        let user = await userModel.findOne({ email })
        if (user && await bcrypt.compare(password, user.password)) {
            let token = jwt.sign({ name: user.name, email: user.email, id: user._id, role: user.role }, process.env.SECRET_KEY_TOKEN)
            return res.status(200).json({ message: "Done", token })

        }
        return next(new appError('incorrect email or password ', 401))
    })

const protectedRoutes = catchError(
    async (req, res, next) => {
        const { token } = req.headers
        if (!token) return next(new appError("TOKEN NOT Provided", 401))
        let decoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN)
        let user = await userModel.findById(decoded.id)
        if (!user) {
            return next(new appError("In-Valid TOKEN ", 401))
        }
        if (user.passwordChangedAt) {
            let passwordChanged = parseInt(user.passwordChangedAt.getTime() / 1000)
            if (passwordChanged > decoded.iat) return next(new appError("In-Valid TOKEN ", 401))
        }

        req.user = user
        next()

    })
const allowedTo = (...roles) => {
    return catchError(
        async (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return next(new appError("You Are Not Authorized to use This Route ... You Are  " + req.user.role, 401))
            }
            next()

        })
}




export {
    signUp,
    signIn,
    allowedTo,
    protectedRoutes
}
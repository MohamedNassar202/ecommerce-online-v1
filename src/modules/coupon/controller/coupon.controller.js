import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { couponModel } from "../../../../database/models/coupon.model.js"
import { deleteOne } from "../../../handler/factor.js"
import QRCode from 'qrcode'
import { ApiFeature } from "../../../utils/apiFeatures.js"


const addCoupon = catchError(
    async (req, res, next) => {
        const coupon = new couponModel(req.body)
        await coupon.save()
        return res.status(201).json({ message: "Done", coupon })
    })

const getAllCoupons = catchError(
    async (req, res, next) => {
        let apiFeature = new ApiFeature(couponModel.find(), req.query).
            paginate().sort().search().fields().filter()

        const allCoupons = await apiFeature.mongooseQuery

        return res.status(200).json({ message: "Done", page: apiFeature.PAGE_NUMBER, allCoupons })
    })
const getSpecificCoupon = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const specificCoupon = await couponModel.findById(id)
        if (specificCoupon) {
            let url = await QRCode.toDataURL(specificCoupon.code)
            return res.status(200).json({ message: "Done", specificCoupon, url })     
        }
        return next(new appError("Coupon Not Found", 404)) 
    })

const updateCoupon = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const coupon = await couponModel.findByIdAndUpdate(id, req.body, { new: true })

        return coupon ? res.status(200).json({ message: "Done", coupon }) :
            next(new appError("Coupon Not Found", 404))
    })

const deleteCoupon = deleteOne(couponModel, "coupon")


export {
    addCoupon,
    getSpecificCoupon,
    deleteCoupon,
    updateCoupon,
    getAllCoupons
}
import slugify from "slugify"
import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { brandModel } from "../../../../database/models/brand.model.js"
import { deleteOne } from "../../../handler/factor.js"
import { ApiFeature } from "../../../utils/apiFeatures.js"


const addBrand = catchError(
    async (req, res, next) => {
        req.body.slug = slugify(req.body.name)
        const brand = new brandModel(req.body)
        await brand.save()
        return res.status(201).json({ message: "Done", brand })
    })

const getAllBrands = catchError(
    async (req, res, next) => {
        let apiFeature = new ApiFeature(brandModel.find(), req.query).
            paginate().sort().search().fields().filter()

        const allBrands = await apiFeature.mongooseQuery

        return res.status(200).json({ message: "Done", page: apiFeature.PAGE_NUMBER, allBrands })
    })
const getSpecificBrand = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const specificBrand = await brandModel.findById(id)

        return specificBrand ? res.status(200).json({ message: "Done", specificBrand }) :
            next(new appError("Brand Not Found", 404))
    })

const updateBrand = catchError(
    async (req, res, next) => {
        const { id } = req.params
        if (req.body.name) req.body.slug = slugify(req.body.name)

        const brand = await brandModel.findByIdAndUpdate(id, req.body, { new: true })

        return brand ? res.status(200).json({ message: "Done", brand }) :
            next(new appError("brand Not Found", 404))
    })

const deleteBrand = deleteOne(brandModel, "brand")


export {
    addBrand,
    getAllBrands,
    getSpecificBrand,
    updateBrand,
    deleteBrand
}
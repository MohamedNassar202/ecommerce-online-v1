import slugify from "slugify"
import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { productModel } from "../../../../database/models/product.model.js"
import { deleteOne } from "../../../handler/factor.js"
import { ApiFeature } from "../../../utils/apiFeatures.js"


const addProduct = catchError(
    async (req, res, next) => {
        req.body.slug = slugify(req.body.title)

        req.body.imageCover = req.files.imageCover[0].filename
        req.body.images = req.files.images.map(elm => elm.filename)

        const product = new productModel(req.body)
        await product.save()
        return res.status(201).json({ message: "Done", product })
    })

const getAllProducts = catchError(
    async (req, res, next) => {

        let apiFeature = new ApiFeature(productModel.find(), req.query).
            paginate().sort().search().fields().filter()

        const allproducts = await apiFeature.mongooseQuery

        return res.status(200).json({ message: "Done", page: apiFeature.PAGE_NUMBER, allproducts })
    })

const getSpecificProduct = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const specificProduct = await productModel.findById(id)

        return specificProduct ? res.status(200).json({ message: "Done", specificProduct }) :
            next(new appError("product Not Found", 404))
    })

const updateProduct = catchError(
    async (req, res, next) => {
        const { id } = req.params
        if (req.body.title) req.body.slug = slugify(req.body.title)

        const product = await productModel.findByIdAndUpdate(id, req.body, { new: true })

        return product ? res.status(200).json({ message: "Done", product }) :
            next(new appError("product Not Found", 404))
    })

const deleteProduct = deleteOne(productModel, "product")


export {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getSpecificProduct
}
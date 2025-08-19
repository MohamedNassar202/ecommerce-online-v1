import { categoryModel } from "../../../../database/models/category.model.js"
import slugify from "slugify"
import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { deleteOne } from "../../../handler/factor.js"
import { ApiFeature } from "../../../utils/apiFeatures.js"


const addCategory = catchError(
    async (req, res, next) => {

        req.body.slug = slugify(req.body.name)
        req.body.image = req.file.filename
        const category = new categoryModel(req.body)
        await category.save()
        return res.status(201).json({ message: "Done", category })
    })

const getAllCategories = catchError(
    async (req, res, next) => {

        let apiFeature = new ApiFeature(categoryModel.find(), req.query).
            paginate().sort().search().fields().filter()

        const allCategories = await apiFeature.mongooseQuery

        return res.status(200).json({ message: "Done", page: apiFeature.PAGE_NUMBER, allCategories })
    })
const getOneCategory = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const category = await categoryModel.findById(id)

        return category ? res.status(200).json({ message: "Done", category }) :
            next(new appError("category not found", 404))
    })

const updateCategory = catchError(
    async (req, res, next) => {
        const { id } = req.params
        req.body.slug = slugify(req.body.name)
        const category = await categoryModel.findByIdAndUpdate(id, req.body, { new: true })

        return category ? res.status(200).json({ message: "Done", category }) :
            next(new appError("Category Not Found", 404))
    })

const deleteCategory = deleteOne(categoryModel, "category")


export {
    addCategory,
    getAllCategories,
    getOneCategory,
    updateCategory,
    deleteCategory
}
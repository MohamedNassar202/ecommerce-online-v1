import slugify from "slugify"
import { catchError } from "../../../utils/catchError.js"
import { appError } from "../../../utils/appErrorClass.js"
import { subCategoryModel } from "../../../../database/models/subcategory.model.js"
import { deleteOne } from "../../../handler/factor.js"


const addSubCategory = catchError(
    async (req, res, next) => {
        req.body.slug = slugify(req.body.name)
        const subCategory = new subCategoryModel(req.body)
        await subCategory.save()
        return res.status(201).json({ message: "Done", subCategory })
    })

const getAllSubCategories = catchError(
    async (req, res, next) => {

        if (req.params.categoryId) {
            const allSubCategories = await subCategoryModel.find({ category: req.params.categoryId })
            return res.status(200).json({ message: "Done", allSubCategories })

        }

        const allSubCategories = await subCategoryModel.find()

        return res.status(200).json({ message: "Done", allSubCategories })
    })
const getOneSubCategory = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const subCategory = await subCategoryModel.findById(id)

        return subCategory ? res.status(200).json({ message: "Done", subCategory }) :
            next(new appError("subCategory not found", 404))
    })

const updateSubCategory = catchError(
    async (req, res, next) => {
        const { id } = req.params
        if (req.body.name) req.body.slug = slugify(req.body.name)

        const subCategory = await subCategoryModel.findByIdAndUpdate(id, req.body, { new: true })

        return subCategory ? res.status(200).json({ message: "Done", subCategory }) :
            next(new appError("subCategory Not Found", 404))
    })

const deleteSubCategory = deleteOne(subCategoryModel, "subCategory")



export {
    addSubCategory,
    getOneSubCategory,
    getAllSubCategories,
    updateSubCategory,
    deleteSubCategory
}
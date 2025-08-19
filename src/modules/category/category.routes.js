import { Router } from "express";
import * as category from "./controller/category.controller.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import { validate } from "../../middleware/validate.js";
import { addCategoryValidation, deleteCategoryValidation, updateCategoryValidation } from "./category.valdation.js";
import { uploadSingleFile } from "../../multer/multer.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const categoryRouter = Router()
categoryRouter.use('/:categoryId/subcategories',subCategoryRouter)
categoryRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'),uploadSingleFile('image','category'),validate(addCategoryValidation),category.addCategory)
    .get(category.getAllCategories)
categoryRouter.route('/:id')
    .get(category.getOneCategory)
    .put(protectedRoutes, allowedTo('admin'),validate(updateCategoryValidation),category.updateCategory)
    .delete(protectedRoutes, allowedTo('admin'),validate(deleteCategoryValidation),category.deleteCategory)





export default categoryRouter
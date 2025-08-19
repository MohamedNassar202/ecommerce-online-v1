import { Router } from "express";
import * as subCategory from "./controller/subCategory.controller.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const subCategoryRouter = Router({ mergeParams: true })

subCategoryRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'),subCategory.addSubCategory)
    .get(subCategory.getAllSubCategories)
subCategoryRouter.route('/:id')
    .get(subCategory.getOneSubCategory)
    .put(protectedRoutes, allowedTo('admin'),subCategory.updateSubCategory)
    .deleteprotectedRoutes, allowedTo('admin'),(subCategory.deleteSubCategory)



export default subCategoryRouter
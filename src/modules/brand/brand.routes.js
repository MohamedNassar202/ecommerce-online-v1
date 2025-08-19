import { Router } from "express";
import * as brand from "./controller/brand.controller.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const brandRouter = Router()

brandRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), brand.addBrand)
    .get(brand.getAllBrands)
brandRouter.route('/:id')
    .get(brand.getSpecificBrand)
    .put(protectedRoutes, allowedTo('admin'), brand.updateBrand)
    .delete(protectedRoutes, allowedTo('admin'), brand.deleteBrand)



export default brandRouter
import { Router } from "express";
import * as product from "./controller/product.controller.js";
import { uploadMixOfFiles } from "../../multer/multer.js";
import { allowedTo, protectedRoutes } from "../auth/controller/auth.controller.js";
const productRouter = Router()
let arrayOfField = [{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 10 }]
productRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), uploadMixOfFiles(arrayOfField, 'product'), product.addProduct)
    .get(product.getAllProducts)
productRouter.route('/:id')
    .put(protectedRoutes, allowedTo('admin'),product.updateProduct)
    .delete(protectedRoutes, allowedTo('admin'),product.deleteProduct)
    .get(product.getSpecificProduct)



export default productRouter
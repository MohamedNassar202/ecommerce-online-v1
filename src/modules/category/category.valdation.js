import Joi from "joi"

let idValidation = Joi.string().hex().length(24).required()
const addCategoryValidation = Joi.object({
    name: Joi.string().alphanum().min(2).max(50).required(),
    
})
const updateCategoryValidation = Joi.object({
    name: Joi.string().alphanum().min(2).max(50),
    id: idValidation
})
const deleteCategoryValidation = Joi.object({
    id: idValidation
})

export {
    addCategoryValidation,
    updateCategoryValidation,
    deleteCategoryValidation
}
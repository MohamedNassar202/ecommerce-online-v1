import { model, Schema, Types } from 'mongoose';

const subCategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: [2, "too short subCategory name"],
        maxLength: [50, "too long subCategory name"]
    },
    slug: {
        type: String,
        lowercase: true,

    },
    category: {
        type: Types.ObjectId,
        ref: "category",
        required: true
    }
}, {
    timestamps: true
});

export const subCategoryModel = model('subCategory', subCategorySchema)
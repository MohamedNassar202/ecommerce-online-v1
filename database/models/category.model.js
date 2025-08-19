import { model, Schema } from 'mongoose';

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: [2, "too short category name"],
        maxLength: [50, "too long category name"]
    },
    slug: {
        type: String,
        lowercase: true,

    },
    image: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});
categorySchema.post('init', function (doc) {
    doc.image = process.env.BASE_URL+'category/' + doc.image
})


export const categoryModel = model('category', categorySchema)
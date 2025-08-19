import { model, Schema, Types } from 'mongoose';

const productSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: [10, "too short product name"],
    },
    slug: {
        type: String,
        lowercase: true,

    },
    description: {
        type: String,
        minLength: [10, "too short product description"],
        maxLength: [100, "too long product description"],
        required: true,
        trim: true
    },

    price: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    priceAfterDiscount: {
        type: Number,
        default: 0,
        min: 0,
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    },
    sold: {
        type: Number,
        default: 0,
        min: 0,
    },
    imageCover: {
        type: String,
        required: true
    },
    images: {
        type: [String],
    },
    category: {
        type: Types.ObjectId,
        ref: "category",
        required: true
    },
    subCategory: {
        type: Types.ObjectId,
        ref: "subCategory",
        required: true
    },
    brand: {
        type: Types.ObjectId,
        ref: "brand",
        required: true
    },
    ratingAvg: {
        type: Number,
        min: 1,
        max: 5,
    },
    ratingCount: {
        type: Number,
        min: 0,
    }


}, {
    timestamps: true,
    toJSON: { virtuals: true }
});
productSchema.post('init', function (doc) {
    if (doc.imageCover && doc.images) {
        doc.imageCover = process.env.BASE_URL + 'product/' + doc.imageCover
        doc.images = doc.images.map(elm => process.env.BASE_URL + 'product/' + elm)
    }
})
productSchema.virtual('myReviews', {
    ref: 'review',
    localField: "_id",
    foreignField: "product"
})
productSchema.pre(/^find/, function () {
    this.populate('myReviews', 'comment rate -_id -product')
})

export const productModel = model('product', productSchema)
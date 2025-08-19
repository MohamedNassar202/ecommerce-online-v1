import { model, Schema, Types } from 'mongoose';

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: [true, "review comment required"],
        trim: true,
    },
    product: {
        type: Types.ObjectId,
        ref: "product",
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: true,
    },
    rate: {
        type: Number,
        min: 1,
        max: 5
    },
}, {
    timestamps: true
});
reviewSchema.pre(/^find/, function () {
    this.populate('user', 'name -_id')
})

export const reviewModel = model('review', reviewSchema)
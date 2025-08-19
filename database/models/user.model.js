import { model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    wishlist: [{
        type: Types.ObjectId,
        ref: 'product'
    }],
    addresses: [{
        city: String,
        street: String,
        phone: String
    }]
}, {
    timestamps: true
});
userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 8)
})
userSchema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 8)
})
export const userModel = model('user', userSchema)
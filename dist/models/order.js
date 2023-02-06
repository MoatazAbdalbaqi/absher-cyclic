"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const orderSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isSpecial: {
        type: Boolean,
        required: true,
    },
    orderMessage: {
        type: String,
        required: false,
        default: '',
    },
    location: {
        type: String,
        required: false,
        default: '',
    },
    items: {
        type: [
            {
                product: { type: Object, required: true },
                quantity: { type: Number, required: true },
                message: { type: String, required: false, default: "" },
            },
        ],
        required: false,
        default: [],
    },
    rejectReson: {
        type: String,
        required: false,
        default: '',
    },
});
exports.default = mongoose_1.default.model('Order', orderSchema);

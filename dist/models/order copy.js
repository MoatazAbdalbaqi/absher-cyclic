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
    items: [
        {
            product: { type: Object, required: true },
            quantity: { type: Number, required: true },
        },
    ],
});
exports.default = mongoose_1.default.model('Order', orderSchema);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ownerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
        default: '/images/fallback.png',
    },
    placeCategory: {
        type: Schema.Types.ObjectId,
        ref: 'PlaceCategory',
        required: true,
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
    ],
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
});
exports.default = mongoose_1.default.model('Owner', ownerSchema);

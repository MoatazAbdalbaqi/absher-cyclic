"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const placeCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    owners: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Owner',
        },
    ],
});
exports.default = mongoose_1.default.model('PlaceCategory', placeCategorySchema);

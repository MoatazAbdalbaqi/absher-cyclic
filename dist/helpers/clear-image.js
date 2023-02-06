"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const clearImage = (filePath) => {
    filePath = path_1.default.join(__dirname, '..', filePath);
    (0, fs_1.unlink)(filePath, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
};
exports.default = clearImage;

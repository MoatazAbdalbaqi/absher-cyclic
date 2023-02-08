"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStream = exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3();
function uploadFile(file) {
    const fileStream = fs_1.default.createReadStream(file.path);
    const uploadParams = {
        Bucket: process.env.BUCKET || "",
        Body: fileStream,
        Key: file === null || file === void 0 ? void 0 : file.filename,
    };
    return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: process.env.BUCKET || '',
    };
    return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;

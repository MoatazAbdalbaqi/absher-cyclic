"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, next) => {
    error.status = error.statusCode || 500;
    return next(error);
};
exports.default = errorHandler;

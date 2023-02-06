"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const error_handler_1 = __importDefault(require("./../helpers/error-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAdmin = (req, res, next) => {
    const authHead = req.get('Authorization');
    if (!authHead) {
        const err = new Error('انت لست ادمن, روح العب بعيد');
        err.statusCode = 401;
        throw err;
    }
    const token = authHead.split(' ')[1];
    let decodedToken;
    try {
        // @ts-ignore
        decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
    }
    catch (err) {
        (0, error_handler_1.default)(err, next);
    }
    user_1.default.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId)
        .then((user) => {
        if (user === null || user === void 0 ? void 0 : user.isAdmin) {
            return next();
        }
        const err = new Error('انت لست ادمن, روح العب بعيد');
        err.statusCode = 404;
        throw err;
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.default = isAdmin;

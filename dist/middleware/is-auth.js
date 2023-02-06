"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const error_handler_1 = __importDefault(require("./../helpers/error-handler"));
const isAuth = (req, res, next) => {
    const authHead = req.get('Authorization');
    if (!authHead) {
        const err = new Error('غير مصرح لك بذلك');
        err.statusCode = 401;
        throw err;
    }
    const token = authHead.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    }
    catch (err) {
        (0, error_handler_1.default)(err, next);
    }
    if (!decodedToken) {
        const err = new Error('غير مصرح لك بذلك');
        err.statusCode = 401;
        throw err;
    }
    req.params.userId = decodedToken.userId;
    next();
};
exports.default = isAuth;

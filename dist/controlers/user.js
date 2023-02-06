"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_handler_1 = __importDefault(require("./../helpers/error-handler"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const signup = (req, res, next) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        err.data = errors.array();
        throw err;
    }
    const name = req.body.name;
    const phone_no = req.body.phone_no;
    const password = req.body.password;
    const address = req.body.address;
    const location = ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.location) || '';
    bcryptjs_1.default
        .hash(password, 12)
        .then((hashedPass) => {
        return new user_1.default({
            phone_no,
            name,
            password: hashedPass,
            address: address,
            location,
        }).save();
    })
        .then(() => {
        (0, exports.login)(req, res, next);
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.signup = signup;
const login = (req, res, next) => {
    const phone_no = req.body.phone_no;
    const password = req.body.password;
    let loadedUser;
    return user_1.default.findOne({ phone_no: phone_no })
        .then((user) => {
        if (!user) {
            const err = new Error('هذا المستخدم غير موجود');
            err.statusCode = 401;
            throw err;
        }
        loadedUser = user;
        return bcryptjs_1.default.compare(password, user.password);
    })
        .then((isMatch) => {
        if (!isMatch) {
            const err = new Error('كلمة مرور خاطئة');
            err.statusCode = 401;
            throw err;
        }
        const token = jsonwebtoken_1.default.sign({ phone_no: loadedUser.phone_no, userId: loadedUser._id.toString() }, process.env.JWT_KEY + '');
        res.status(200).json({ token, userId: loadedUser._id });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.login = login;

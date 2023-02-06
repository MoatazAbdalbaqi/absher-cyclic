"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const user_2 = require("./../controlers/user");
const router = (0, express_1.Router)();
router.post('/signup', [
    (0, express_validator_1.body)('phone_no')
        .trim()
        .isLength({ min: 9, max: 9 })
        .isNumeric()
        .custom((value) => {
        return user_1.default.findOne({ phone_no: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject('هذا الرقم موجود بالفعل');
            }
        });
    }),
    (0, express_validator_1.body)('password').trim().isLength({ min: 6, max: 30 }),
    (0, express_validator_1.body)('name').trim().not().isEmpty(),
    (0, express_validator_1.body)('address').trim().not().isEmpty(),
], user_2.signup);
router.post('/login', user_2.login);
exports.default = router;

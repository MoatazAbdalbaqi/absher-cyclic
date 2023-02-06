"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const is_admin_1 = __importDefault(require("./../middleware/is-admin"));
const is_auth_1 = __importDefault(require("./../middleware/is-auth"));
const user_1 = __importDefault(require("../models/user"));
const order_1 = require("./../controlers/order");
const router = (0, express_1.Router)();
router.get('/', is_admin_1.default, is_auth_1.default, order_1.getOrders);
router.get('/user/:userId', is_auth_1.default, is_admin_1.default, order_1.getOrdersByUserId);
router.get('/my-orders', is_auth_1.default, order_1.getUserOrders);
router.post('/', is_auth_1.default, [
    (0, express_validator_1.body)('userId').custom((value) => {
        return user_1.default.findById(value).then((user) => {
            if (!user) {
                return Promise.reject('هذا الحساب غير موجود');
            }
        });
    }),
], order_1.createOrder);
router.put('/:orderId', is_admin_1.default, is_auth_1.default, [(0, express_validator_1.body)('status').trim().not().isEmpty()], order_1.updateOrder);
router.delete('/:orderId', is_admin_1.default, is_auth_1.default, order_1.deleteOrder);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrdersByUserId = exports.getOrders = void 0;
const error_handler_1 = __importDefault(require("../helpers/error-handler"));
const order_1 = __importDefault(require("../models/order"));
const express_validator_1 = require("express-validator");
// TODO: test
const getOrders = (req, res, next) => {
    order_1.default.find()
        .populate('user')
        .then((orders) => {
        if (!orders) {
            const err = new Error('لا يوجد طلبات حتى الان');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ orders: orders });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getOrders = getOrders;
// TODO: test maybe need to fix
const getOrdersByUserId = (req, res, next) => {
    order_1.default.find({ user: { $eq: `${req.params.userId}` } })
        .populate('items')
        .then((orders) => {
        if (!orders) {
            const err = new Error('لا يوجد طلبات بعد');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ orders: orders });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getOrdersByUserId = getOrdersByUserId;
const createOrder = (req, res, next) => {
    const items = req.body.items;
    const userId = req.body.userId;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        throw err;
    }
    order_1.default.create({
        date: new Date().toISOString(),
        status: 'review',
        user: userId,
        items: items,
    })
        .then((order) => {
        return res.json({ message: 'تم الطلب بنجاح', order: order });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.createOrder = createOrder;
const updateOrder = (req, res, next) => {
    const status = req.body.status;
    if (status != 'approved' && status != 'delivered') {
        const err = new Error('قيمة خاطئة لحالة الطلب');
        err.statusCode = 442;
        throw err;
    }
    order_1.default.findById(req.params.orderId)
        .then((order) => {
        if (!order) {
            const err = new Error('هذا الطلب غير موجود');
            err.statusCode = 404;
            throw err;
        }
        order.status = status;
        return order.save();
    })
        .then(() => {
        // io.getIO().emit('products', { action: 'delete', Order: OwnerId });
        res.status(200).json({ message: 'تم تحديث حالة الطلب بنجاح' });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.updateOrder = updateOrder;
const deleteOrder = (req, res, next) => {
    order_1.default.findById(req.params.orderId)
        .then((order) => {
        if (!order) {
            const err = new Error('هذا الطلب غير موجود');
            err.statusCode = 404;
            throw err;
        }
        return order.delete();
    })
        .then(() => {
        // io.getIO().emit('products', { action: 'delete', Order: OwnerId });
        res.status(200).json({ message: 'تم حذف الطلب بنجاح' });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.deleteOrder = deleteOrder;

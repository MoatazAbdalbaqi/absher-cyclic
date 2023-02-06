"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const error_handler_1 = __importDefault(require("./../helpers/error-handler"));
const category_1 = __importDefault(require("../models/category"));
const express_validator_1 = require("express-validator");
const getCategories = (req, res, next) => {
    category_1.default.find()
        .populate('products')
        .then((categories) => {
        if (!categories) {
            const err = new Error('لا يوجد اصناف حتى الان');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ categories: categories });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getCategories = getCategories;
const getCategoryById = (req, res, next) => {
    category_1.default.findById(req.params.categoryId)
        .populate('products')
        .then((category) => {
        if (!category) {
            const err = new Error('هذا الصنف غير موجود');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ category: category });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getCategoryById = getCategoryById;
const createCategory = (req, res, next) => {
    const name = req.body.name;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        throw err;
    }
    category_1.default.create({
        name,
        products: [],
    })
        .then((category) => {
        return res.json({ message: 'تم انشاء الصنف بنجاح', category: category });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.createCategory = createCategory;
const updateCategory = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        throw err;
    }
    const name = req.body.name;
    category_1.default.findById(req.params.categoryId)
        .then((category) => {
        if (!category) {
            const err = new Error('هذا الصنف غير موجود');
            err.statusCode = 404;
            throw err;
        }
        category.name = name;
        return category.save();
    })
        .then((category) => {
        // io.getIO().emit('products', { action: 'update', Category: result });
        res
            .status(200)
            .json({ message: 'تم تحديث الصنف بنجاح', category: category });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.updateCategory = updateCategory;
const deleteCategory = (req, res, next) => {
    category_1.default.findById(req.params.categoryId)
        .then((Category) => {
        if (!Category) {
            const err = new Error('هذا الصنف غير موجود');
            err.statusCode = 404;
            throw err;
        }
        return Category.delete();
    })
        .then(() => {
        // io.getIO().emit('products', { action: 'delete', Category: OwnerId });
        res.status(200).json({ message: 'تم حذف الصنف بنجاح' });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.deleteCategory = deleteCategory;

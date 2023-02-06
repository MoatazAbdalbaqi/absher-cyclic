"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlaceCategory = exports.updatePlaceCategory = exports.createPlaceCategory = exports.getPlaceCategoryById = exports.getPlaceCategories = void 0;
const error_handler_1 = __importDefault(require("../helpers/error-handler"));
const place_category_1 = __importDefault(require("../models/place-category"));
const express_validator_1 = require("express-validator");
const getPlaceCategories = (req, res, next) => {
    place_category_1.default.find()
        .then((placeCategories) => {
        if (!placeCategories) {
            const err = new Error('لا يوجد اصناف حتى الان');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ placeCategories: placeCategories });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getPlaceCategories = getPlaceCategories;
const getPlaceCategoryById = (req, res, next) => {
    place_category_1.default.findById(req.params.placeCategoryId)
        .populate('owners')
        .then((placeCategory) => {
        if (!placeCategory) {
            const err = new Error('هذا الصنف غير موجود');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ placeCategory: placeCategory });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getPlaceCategoryById = getPlaceCategoryById;
const createPlaceCategory = (req, res, next) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        throw err;
    }
    const name = req.body.name;
    const icon = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) || '/images/fallback.png';
    place_category_1.default.create({
        name,
        icon,
        owners: [],
    })
        .then((placeCategory) => {
        return res.json({
            message: 'تم انشاء الصنف بنجاح',
            placeCategory: placeCategory,
        });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.createPlaceCategory = createPlaceCategory;
const updatePlaceCategory = (req, res, next) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        throw err;
    }
    const name = req.body.name;
    const icon = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) || '/images/place-category-fallback.png';
    place_category_1.default.findById(req.params.placeCategoryId)
        .then((palceCategory) => {
        if (!palceCategory) {
            const err = new Error('هذا الصنف غير موجود');
            err.statusCode = 404;
            throw err;
        }
        palceCategory.name = name;
        palceCategory.icon = icon;
        return palceCategory.save();
    })
        .then((palceCategory) => {
        // io.getIO().emit('products', { action: 'update', PlaceCategory: result });
        res
            .status(200)
            .json({ message: 'تم تحديث الصنف بنجاح', palceCategory: palceCategory });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.updatePlaceCategory = updatePlaceCategory;
const deletePlaceCategory = (req, res, next) => {
    place_category_1.default.findById(req.params.placeCategoryId)
        .then((PlaceCategory) => {
        if (!PlaceCategory) {
            const err = new Error('هذا الصنف غير موجود');
            err.statusCode = 404;
            throw err;
        }
        return PlaceCategory.delete();
    })
        .then(() => {
        // io.getIO().emit('products', { action: 'delete', PlaceCategory: OwnerId });
        res.status(200).json({ message: 'تم حذف الصنف بنجاح' });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.deletePlaceCategory = deletePlaceCategory;

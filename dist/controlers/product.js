"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.deleteProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const error_handler_1 = __importDefault(require("./../helpers/error-handler"));
const product_1 = __importDefault(require("../models/product"));
const owner_1 = __importDefault(require("../models/owner"));
const category_1 = __importDefault(require("../models/category"));
const express_validator_1 = require("express-validator");
// import clearImage from './../helpers/clear-image';
const getProducts = (req, res, next) => {
    product_1.default.find()
        .populate("category")
        .then((products) => {
        if (!products) {
            const err = new Error('لا يوجد منتجات حتى الان');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ products: products });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getProducts = getProducts;
const getProductById = (req, res, next) => {
    product_1.default.findById(req.params.productId)
        .populate('owner')
        .populate('category')
        .then((product) => {
        if (!product) {
            const err = new Error('المنتج غير موجود');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ product });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getProductById = getProductById;
const createProduct = (req, res, next) => {
    var _a;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const categoryId = req.body.categoryId;
    const ownerId = req.body.ownerId;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        throw err;
    }
    const imageUrl = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) || '/images/fallback.png';
    product_1.default.create({
        name,
        description,
        price,
        imageUrl,
        category: categoryId,
        owner: ownerId,
    })
        .then((product) => __awaiter(void 0, void 0, void 0, function* () {
        yield owner_1.default.findByIdAndUpdate(ownerId, { $push: { products: product } });
        yield category_1.default.findByIdAndUpdate(categoryId, {
            $push: { products: product },
        });
        res.json({ massage: 'تم انشاء المنتج بنجاح', product: product });
    }))
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.createProduct = createProduct;
const deleteProduct = (req, res, next) => {
    product_1.default.findById(req.params.productId)
        .then((product) => {
        if (!product) {
            const err = new Error('المنتج غير موجود');
            err.statusCode = 404;
            throw err;
        }
        // clearImage(product.imageUrl);
        return product.delete();
    })
        .then((product) => __awaiter(void 0, void 0, void 0, function* () {
        yield owner_1.default.findById(product.owner).then((owner) => {
            if (owner === null || owner === void 0 ? void 0 : owner.products) {
                owner.products = owner === null || owner === void 0 ? void 0 : owner.products.filter((item) => item.toString() !== product._id.toString());
            }
            owner === null || owner === void 0 ? void 0 : owner.save();
        });
        yield category_1.default.findById(product.category).then((category) => {
            if (category === null || category === void 0 ? void 0 : category.products) {
                category.products = category === null || category === void 0 ? void 0 : category.products.filter((item) => item.toString() !== product._id.toString());
            }
            category === null || category === void 0 ? void 0 : category.save();
        });
    }))
        .then(() => {
        // io.getIO().emit('products', { action: 'delete', product: postId });
        res.status(200).json({ message: 'تم حذف المنتج بنجاح' });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res, next) => {
    var _a;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const categoryId = req.body.categoryId;
    const ownerId = req.body.ownerId;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        throw err;
    }
    const imageUrl = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) || '/images/fallback.png';
    let oldOwnerId;
    let oldCategoryId;
    product_1.default.findById(req.params.productId)
        .then((product) => {
        if (!product) {
            const err = new Error('المنتج غير موجود');
            err.statusCode = 404;
            throw err;
        }
        oldOwnerId = product.owner.toString();
        oldCategoryId = product.category.toString();
        product.name = name;
        product.description = description;
        product.price = price;
        product.imageUrl = imageUrl;
        product.category = categoryId;
        product.owner = ownerId;
        return product.save();
    })
        .then((product) => __awaiter(void 0, void 0, void 0, function* () {
        if (oldOwnerId !== product.owner.toString()) {
            yield owner_1.default.findById(oldOwnerId).then((owner) => {
                if (owner === null || owner === void 0 ? void 0 : owner.products) {
                    owner.products = owner === null || owner === void 0 ? void 0 : owner.products.filter((item) => item.toString() !== product._id.toString());
                }
                owner === null || owner === void 0 ? void 0 : owner.save();
            });
            yield owner_1.default.findById(product.owner).then((owner) => {
                if (owner === null || owner === void 0 ? void 0 : owner.products) {
                    owner.products.push(product._id);
                }
                owner === null || owner === void 0 ? void 0 : owner.save();
            });
        }
        if (oldCategoryId !== product.owner.toString()) {
            yield category_1.default.findById(oldCategoryId).then((category) => {
                if (category === null || category === void 0 ? void 0 : category.products) {
                    category.products = category === null || category === void 0 ? void 0 : category.products.filter((item) => item.toString() !== product._id.toString());
                }
                category === null || category === void 0 ? void 0 : category.save();
            });
            yield category_1.default.findById(product.category).then((category) => {
                if (category === null || category === void 0 ? void 0 : category.products) {
                    category.products.push(product._id);
                }
                category === null || category === void 0 ? void 0 : category.save();
            });
        }
        return product;
    }))
        .then((product) => {
        res.json({ massage: 'تم تحديث المنتج بنجاح', product: product });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.updateProduct = updateProduct;

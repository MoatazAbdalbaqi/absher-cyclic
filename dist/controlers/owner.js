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
exports.deleteOwner = exports.updateOwner = exports.createOwner = exports.getOwnerById = exports.getOwners = void 0;
const error_handler_1 = __importDefault(require("./../helpers/error-handler"));
const owner_1 = __importDefault(require("../models/owner"));
const express_validator_1 = require("express-validator");
const place_category_1 = __importDefault(require("../models/place-category"));
const clear_image_1 = __importDefault(require("./../helpers/clear-image"));
const product_1 = __importDefault(require("../models/product"));
const getOwners = (req, res, next) => {
    owner_1.default.find()
        .populate('categories')
        .populate('products')
        .populate('placeCategory')
        .then((owners) => {
        if (!owners) {
            const err = new Error('لا يوجد مُلّاك حتى الان');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ owners: owners });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getOwners = getOwners;
const getOwnerById = (req, res, next) => {
    owner_1.default.findById(req.params.ownerId)
        .populate('categories')
        .populate('products')
        .populate('placeCategory')
        .then((owner) => {
        if (!owner) {
            const err = new Error('هذا المالك غير موجود');
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ owner: owner });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.getOwnerById = getOwnerById;
const createOwner = (req, res, next) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        throw err;
    }
    const name = req.body.name;
    const description = req.body.description;
    const address = req.body.address;
    const categoryIds = req.body.categoryIds.split(',');
    const category = req.body.category;
    const imageUrl = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) || '/images/fallback.png';
    owner_1.default.create({
        name,
        description,
        address,
        imageUrl,
        categories: categoryIds,
        placeCategory: category,
        products: [],
    })
        .then((owner) => __awaiter(void 0, void 0, void 0, function* () {
        yield place_category_1.default.findByIdAndUpdate(owner.placeCategory._id, {
            $push: { owners: owner },
        });
        res.json({ message: 'تم انشاء المالك بنجاح', owner: owner });
    }))
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.createOwner = createOwner;
const updateOwner = (req, res, next) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        const err = new Error(errors.array());
        err.statusCode = 442;
        throw err;
    }
    const name = req.body.name;
    const description = req.body.description;
    const address = req.body.address;
    const categoryIds = req.body.categoryIds;
    const category = req.body.category;
    let imageUrl = (_a = req.body) === null || _a === void 0 ? void 0 : _a.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    owner_1.default.findById(req.params.ownerId)
        .then((owner) => {
        if (!owner) {
            const err = new Error('هذا المالك غير موجود');
            err.statusCode = 404;
            throw err;
        }
        // if (imageUrl !== owner.imageUrl) {
        // 	clearImage(owner?.imageUrl || '');
        // }
        owner.name = name;
        owner.description = description;
        owner.address = address;
        owner.categories = categoryIds;
        owner.placeCategory = category;
        owner.imageUrl = imageUrl;
        return owner.save();
    })
        .then((result) => {
        // io.getIO().emit('products', { action: 'update', Owner: result });
        res.status(200).json({ message: 'تم تحديث المالك بنجاح', owner: result });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.updateOwner = updateOwner;
const deleteOwner = (req, res, next) => {
    owner_1.default.findById(req.params.ownerId)
        .then((owner) => {
        if (!owner) {
            const err = new Error('هذا المالك غير موجود');
            err.statusCode = 404;
            throw err;
        }
        product_1.default.deleteMany({ owner: owner })
            .then((pro) => console.log('delete product', pro._id))
            .catch((err) => console.log(err));
        (0, clear_image_1.default)((owner === null || owner === void 0 ? void 0 : owner.imageUrl) || '');
        return owner.delete();
    })
        .then(() => {
        // io.getIO().emit('products', { action: 'delete', owner: OwnerId });
        res.status(200).json({ message: 'تم حذف المالك بنجاح' });
    })
        .catch((err) => (0, error_handler_1.default)(err, next));
};
exports.deleteOwner = deleteOwner;

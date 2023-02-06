"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const is_admin_1 = __importDefault(require("./../middleware/is-admin"));
const is_auth_1 = __importDefault(require("./../middleware/is-auth"));
const place_category_1 = require("../controlers/place-category");
const router = (0, express_1.Router)();
router.get('/:placeCategoryId', place_category_1.getPlaceCategoryById);
router.get('/', place_category_1.getPlaceCategories);
router.post('/', is_admin_1.default, is_auth_1.default, [(0, express_validator_1.body)('name').trim().not().isEmpty()], 
// @ts-ignore
place_category_1.createPlaceCategory);
router.put('/:placeCategoryId', is_admin_1.default, is_auth_1.default, [(0, express_validator_1.body)('name').trim().not().isEmpty()], place_category_1.updatePlaceCategory);
router.delete('/:placeCategoryId', is_admin_1.default, is_auth_1.default, place_category_1.deletePlaceCategory);
exports.default = router;

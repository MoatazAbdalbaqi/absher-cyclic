"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const is_admin_1 = __importDefault(require("./../middleware/is-admin"));
const is_auth_1 = __importDefault(require("./../middleware/is-auth"));
const category_1 = require("../controlers/category");
const router = (0, express_1.Router)();
router.get('/:categoryId', category_1.getCategoryById);
router.get('/', category_1.getCategories);
router.post('/', is_admin_1.default, is_auth_1.default, [(0, express_validator_1.body)('name').trim().not().isEmpty()], category_1.createCategory);
router.put('/:categoryId', is_admin_1.default, is_auth_1.default, [(0, express_validator_1.body)('name').trim().not().isEmpty()], category_1.updateCategory);
router.delete('/:categoryId', is_admin_1.default, is_auth_1.default, category_1.deleteCategory);
exports.default = router;

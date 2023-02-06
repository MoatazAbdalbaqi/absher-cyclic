"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const is_admin_1 = __importDefault(require("./../middleware/is-admin"));
const is_auth_1 = __importDefault(require("./../middleware/is-auth"));
const product_1 = require("../controlers/product");
const router = (0, express_1.Router)();
router.get('/:productId', product_1.getProductById);
router.get('/', product_1.getProducts);
router.post('/', is_admin_1.default, is_auth_1.default, [
    (0, express_validator_1.body)('name').trim().not().isEmpty(),
    (0, express_validator_1.body)('description').trim().not().isEmpty(),
    (0, express_validator_1.body)('price').trim().not().isEmpty(),
    (0, express_validator_1.body)('categoryId').trim().not().isEmpty(),
    (0, express_validator_1.body)('ownerId').trim().not().isEmpty(),
], 
// @ts-ignore
product_1.createProduct);
router.put('/:productId', is_admin_1.default, is_auth_1.default, [
    (0, express_validator_1.body)('name').trim().not().isEmpty(),
    (0, express_validator_1.body)('description').trim().not().isEmpty(),
    (0, express_validator_1.body)('price').trim().not().isEmpty(),
    (0, express_validator_1.body)('categoryId').trim().not().isEmpty(),
    (0, express_validator_1.body)('ownerId').trim().not().isEmpty(),
], 
// @ts-ignore
product_1.updateProduct);
router.delete('/:productId', is_admin_1.default, is_auth_1.default, product_1.deleteProduct);
exports.default = router;

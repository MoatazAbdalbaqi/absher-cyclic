"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const is_admin_1 = __importDefault(require("./../middleware/is-admin"));
const is_auth_1 = __importDefault(require("./../middleware/is-auth"));
const owner_1 = require("../controlers/owner");
const router = (0, express_1.Router)();
router.get('/', owner_1.getOwners);
router.get('/:ownerId', owner_1.getOwnerById);
router.post('/', is_admin_1.default, is_auth_1.default, [
    (0, express_validator_1.body)('name').trim().not().isEmpty(),
    (0, express_validator_1.body)('description').trim().not().isEmpty(),
    (0, express_validator_1.body)('address').trim().not().isEmpty(),
    (0, express_validator_1.body)('categoryIds').trim().not().isEmpty(),
    (0, express_validator_1.body)('category').trim().not().isEmpty(),
], 
// @ts-ignore
owner_1.createOwner);
router.put('/', is_admin_1.default, is_auth_1.default, [
    (0, express_validator_1.body)('name').trim().not().isEmpty(),
    (0, express_validator_1.body)('description').trim().not().isEmpty(),
    (0, express_validator_1.body)('address').trim().not().isEmpty(),
    (0, express_validator_1.body)('categoryIds').trim().not().isEmpty(),
    (0, express_validator_1.body)('category').trim().not().isEmpty(),
], 
// @ts-ignore
owner_1.updateOwner);
router.delete('/:ownerId', is_admin_1.default, is_auth_1.default, owner_1.deleteOwner);
exports.default = router;

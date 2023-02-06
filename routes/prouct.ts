import { Router } from 'express';
import { body } from 'express-validator';

import isAdmin from './../middleware/is-admin';
import isAuth from './../middleware/is-auth';

import {
	createProduct,
	deleteProduct,
	getProductById,
	getProducts,
	updateProduct,
} from '../controlers/product';

const router = Router();

router.get('/:productId', getProductById);
router.get('/', getProducts);
router.post(
	'/',
	isAdmin,
	isAuth,
	[
		body('name').trim().not().isEmpty(),
		body('description').trim().not().isEmpty(),
		body('price').trim().not().isEmpty(),
		body('categoryId').trim().not().isEmpty(),
		body('ownerId').trim().not().isEmpty(),
	],
	// @ts-ignore
	createProduct
);
router.put(
	'/:productId',
	isAdmin,
	isAuth,
	[
		body('name').trim().not().isEmpty(),
		body('description').trim().not().isEmpty(),
		body('price').trim().not().isEmpty(),
		body('categoryId').trim().not().isEmpty(),
		body('ownerId').trim().not().isEmpty(),
	],
	// @ts-ignore
	updateProduct
);
router.delete('/:productId', isAdmin, isAuth, deleteProduct);

export default router;

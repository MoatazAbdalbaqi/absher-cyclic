import { Router } from 'express';
import { body } from 'express-validator';

import isAdmin from './../middleware/is-admin';
import isAuth from './../middleware/is-auth';

import {
	createCategory,
	deleteCategory,
	getCategories,
	getCategoryById,
	updateCategory,
} from '../controlers/category';

const router = Router();

router.get('/:categoryId', getCategoryById);
router.get('/', getCategories);
router.post(
	'/',
	isAdmin,
	isAuth,
	[body('name').trim().not().isEmpty()],
	createCategory
);
router.put(
	'/:categoryId',
	isAdmin,
	isAuth,
	[body('name').trim().not().isEmpty()],
	updateCategory
);
router.delete('/:categoryId', isAdmin, isAuth, deleteCategory);

export default router;

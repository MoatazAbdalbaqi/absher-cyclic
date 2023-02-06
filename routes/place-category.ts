import { Router } from 'express';
import { body } from 'express-validator';

import isAdmin from './../middleware/is-admin';
import isAuth from './../middleware/is-auth';

import {
	createPlaceCategory,
	deletePlaceCategory,
	getPlaceCategories,
	getPlaceCategoryById,
	updatePlaceCategory,
} from '../controlers/place-category';

const router = Router();

router.get('/:placeCategoryId', getPlaceCategoryById);
router.get('/', getPlaceCategories);
router.post(
	'/',
	isAdmin,
	isAuth,
	[body('name').trim().not().isEmpty()],
	// @ts-ignore
	createPlaceCategory
);
router.put(
	'/:placeCategoryId',
	isAdmin,
	isAuth,
	[body('name').trim().not().isEmpty()],
	updatePlaceCategory
);
router.delete('/:placeCategoryId', isAdmin, isAuth, deletePlaceCategory);

export default router;

import { Router } from 'express';
import { body } from 'express-validator';

import isAdmin from './../middleware/is-admin';
import isAuth from './../middleware/is-auth';

import {
	createOwner,
	updateOwner,
	deleteOwner,
	getOwners,
	getOwnerById,
} from '../controlers/owner';

const router = Router();

router.get('/', getOwners);
router.get('/:ownerId', getOwnerById);
router.post(
	'/',
	isAdmin,
	isAuth,
	[
		body('name').trim().not().isEmpty(),
		body('description').trim().not().isEmpty(),
		body('address').trim().not().isEmpty(),
		body('categoryIds').trim().not().isEmpty(),
		body('category').trim().not().isEmpty(),
	],
	// @ts-ignore
	createOwner
);

router.put(
	'/',
	isAdmin,
	isAuth,
	[
		body('name').trim().not().isEmpty(),
		body('description').trim().not().isEmpty(),
		body('address').trim().not().isEmpty(),
		body('categoryIds').trim().not().isEmpty(),
		body('category').trim().not().isEmpty(),
	],
	// @ts-ignore
	updateOwner
);
router.delete('/:ownerId', isAdmin, isAuth, deleteOwner);

export default router;

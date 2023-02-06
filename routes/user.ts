import { Router } from 'express';
import { body } from 'express-validator';
import User from '../models/user';
import { User as UserType } from '../types';
import { signup, login } from './../controlers/user';

const router = Router();

router.post(
	'/signup',
	[
		body('phone_no')
			.trim()
			.isLength({min:9,max:9})
			.isNumeric()
			.custom((value) => {
				return User.findOne({ phone_no: value }).then((userDoc: UserType) => {
					if (userDoc) {
						return Promise.reject('هذا الرقم موجود بالفعل');
					}
				});
			}),
		body('password').trim().isLength({ min: 6, max: 30 }),
		body('name').trim().not().isEmpty(),
		body('address').trim().not().isEmpty(),
	],
	signup
);

router.post('/login', login);

export default router;

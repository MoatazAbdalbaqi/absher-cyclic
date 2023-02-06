import { Router } from 'express';
import { body } from 'express-validator';
import isAdmin from './../middleware/is-admin';
import isAuth from './../middleware/is-auth';

import User from '../models/user';
import { User as UserType } from '../types';

import {
	getOrders,
	getOrdersByUserId,
	getUserOrders,
	createOrder,
	updateOrder,
	deleteOrder,
} from './../controlers/order';

const router = Router();

router.get('/', isAdmin, isAuth, getOrders);
router.get('/user/:userId', isAuth, isAdmin, getOrdersByUserId);
router.get('/my-orders', isAuth, getUserOrders);

router.post(
	'/',
	isAuth,
	[
		body('userId').custom((value) => {
			return User.findById(value).then((user: UserType) => {
				if (!user) {
					return Promise.reject('هذا الحساب غير موجود');
				}
			});
		}),
	],
	createOrder
);
router.put(
	'/:orderId',
	isAdmin,
	isAuth,
	[body('status').trim().not().isEmpty()],
	updateOrder
);
router.delete('/:orderId', isAdmin, isAuth, deleteOrder);

export default router;

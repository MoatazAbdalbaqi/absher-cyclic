import { Request, Response, NextFunction } from 'express';
import errorHandler from './../helpers/error-handler';

import Order from '../models/order';
import { validationResult } from 'express-validator';
import { CustomError } from './../types/index';
import jwt from 'jsonwebtoken';

// TODO: test
export const getOrders = (_: Request, res: Response, next: NextFunction) => {
	Order.find()
		.populate('items')
		.populate('user')
		.then((orders) => {
			if (!orders) {
				const err: CustomError = new Error('لا يوجد طلبات حتى الان');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ orders: orders });
		})
		.catch((err: any) => errorHandler(err, next));
};
// TODO: test maybe need to fix
export const getOrdersByUserId = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Order.find({ user: { $eq: `${req.params.userId}` } })
		.populate('items')
		.then((orders) => {
			if (!orders) {
				const err: CustomError = new Error('لا يوجد طلبات بعد');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ orders: orders });
		})
		.catch((err) => errorHandler(err, next));
};
export const getUserOrders = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHead = req.get('Authorization');
	if (!authHead) {
		const err: CustomError = new Error('not authanticated!');
		err.statusCode = 401;
		throw err;
	}
	const token = authHead.split(' ')[1];
	let decodedToken: any;
	try {
		// @ts-ignore
		decodedToken = jwt.verify(token, process.env.JWT_KEY);
	} catch (err) {
		errorHandler(err, next);
	}

	Order.find({ user: { $eq: `${decodedToken?.userId}` } })
		.populate('items')
		.then((orders) => {
			if (!orders) {
				const err: CustomError = new Error('لا يوجد طلبات بعد');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ orders: orders });
		})
		.catch((err) => errorHandler(err, next));
};
export const createOrder = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const items = req.body?.items || [];
	const orderMessage = req.body?.orderMessage || '';
	const location = req.body?.location || '';
	const userId = req.body.userId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// @ts-ignore
		const err: CustomError = new Error(errors.array());
		err.statusCode = 442;
		throw err;
	}
	if (items && items.length && orderMessage && orderMessage.length) {
		const err: CustomError = new Error(
			'لا يمكن ان تطلب طلب عادي وخاص في نفس الوقت'
		);
		err.statusCode = 442;
		throw err;
	}
	Order.create({
		date: new Date().toISOString(),
		status: 'review',
		user: userId,
		items: items,
		orderMessage,
		isSpecial: !!orderMessage.length,
		location,
	})
		.then((order) => {
			return res.json({ message: 'تم الطلب بنجاح', order: order });
		})
		.catch((err) => errorHandler(err, next));
};
export const updateOrder = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const status = req.body.status;
	if (status != 'approved' && status != 'delivered' && status != 'rejected' ) {
		const err: CustomError = new Error('قيمة خاطئة لحالة الطلب');
		err.statusCode = 442;
		throw err;
	}
	Order.findById(req.params.orderId)
		.then((order) => {
			if (!order) {
				const err: CustomError = new Error('هذا الطلب غير موجود');
				err.statusCode = 404;
				throw err;
			}
			order.status = status;
			return order.save();
		})
		.then(() => {
			// TODO:
			// io.getIO().emit('products', { action: 'delete', Order: OwnerId });
			res.status(200).json({ message: 'تم تحديث حالة الطلب بنجاح' });
		})
		.catch((err) => errorHandler(err, next));
};
export const deleteOrder = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Order.findById(req.params.orderId)
		.then((order) => {
			if (!order) {
				const err: CustomError = new Error('هذا الطلب غير موجود');
				err.statusCode = 404;
				throw err;
			}
			return order.delete();
		})
		.then(() => {
			// io.getIO().emit('products', { action: 'delete', Order: OwnerId });
			res.status(200).json({ message: 'تم حذف الطلب بنجاح' });
		})
		.catch((err) => errorHandler(err, next));
};

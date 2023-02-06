import { Request, Response, NextFunction } from 'express';
import errorHandler from './../helpers/error-handler';

import Category from '../models/category';
import { validationResult } from 'express-validator';
import { CustomError } from './../types/index';

export const getCategories = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Category.find()
		.populate('products')
		.then((categories: any[]) => {
			if (!categories) {
				const err: CustomError = new Error('لا يوجد اصناف حتى الان');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ categories: categories });
		})
		.catch((err: any) => errorHandler(err, next));
};
export const getCategoryById = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Category.findById(req.params.categoryId)
		.populate('products')
		.then((category) => {
			if (!category) {
				const err: CustomError = new Error('هذا الصنف غير موجود');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ category: category });
		})
		.catch((err) => errorHandler(err, next));
};
export const createCategory = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const name = req.body.name;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// @ts-ignore
		const err: CustomError = new Error(errors.array());
		err.statusCode = 442;
		throw err;
	}
	Category.create({
		name,
		products: [],
	})
		.then((category) => {
			return res.json({ message: 'تم انشاء الصنف بنجاح', category: category });
		})
		.catch((err) => errorHandler(err, next));
};
export const updateCategory = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// @ts-ignore
		const err: CustomError = new Error(errors.array());
		err.statusCode = 442;
		throw err;
	}
	const name = req.body.name;
	Category.findById(req.params.categoryId)
		.then((category) => {
			if (!category) {
				const err: CustomError = new Error('هذا الصنف غير موجود');
				err.statusCode = 404;
				throw err;
			}
			category.name = name;
			return category.save();
		})
		.then((category) => {
			// io.getIO().emit('products', { action: 'update', Category: result });
			res
				.status(200)
				.json({ message: 'تم تحديث الصنف بنجاح', category: category });
		})
		.catch((err: any) => errorHandler(err, next));
};
export const deleteCategory = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Category.findById(req.params.categoryId)
		.then((Category) => {
			if (!Category) {
				const err: CustomError = new Error('هذا الصنف غير موجود');
				err.statusCode = 404;
				throw err;
			}
			return Category.delete();
		})
		.then(() => {
			// io.getIO().emit('products', { action: 'delete', Category: OwnerId });
			res.status(200).json({ message: 'تم حذف الصنف بنجاح' });
		})
		.catch((err) => errorHandler(err, next));
};

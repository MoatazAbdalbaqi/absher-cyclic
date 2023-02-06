import { Request, Response, NextFunction } from 'express';
import errorHandler from '../helpers/error-handler';

import PlaceCategory from '../models/place-category';
import { validationResult } from 'express-validator';
import { CustomError, MulterRequest } from '../types/index';

export const getPlaceCategories = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	PlaceCategory.find()
		.then((placeCategories) => {
			if (!placeCategories) {
				const err: CustomError = new Error('لا يوجد اصناف حتى الان');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ placeCategories: placeCategories });
		})
		.catch((err: any) => errorHandler(err, next));
};
export const getPlaceCategoryById = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	PlaceCategory.findById(req.params.placeCategoryId)
		.populate('owners')
		.then((placeCategory) => {
			if (!placeCategory) {
				const err: CustomError = new Error('هذا الصنف غير موجود');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ placeCategory: placeCategory });
		})
		.catch((err) => errorHandler(err, next));
};
export const createPlaceCategory = (
	req: MulterRequest,
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
	const icon = req?.file?.path || '/images/fallback.png';
	PlaceCategory.create({
		name,
		icon,
		owners: [],
	})
		.then((placeCategory) => {
			return res.json({
				message: 'تم انشاء الصنف بنجاح',
				placeCategory: placeCategory,
			});
		})
		.catch((err) => errorHandler(err, next));
};
export const updatePlaceCategory = (
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
	const icon = req?.file?.path || '/images/place-category-fallback.png';
	PlaceCategory.findById(req.params.placeCategoryId)
		.then((palceCategory) => {
			if (!palceCategory) {
				const err: CustomError = new Error('هذا الصنف غير موجود');
				err.statusCode = 404;
				throw err;
			}
			palceCategory.name = name;
			palceCategory.icon = icon;
			return palceCategory.save();
		})
		.then((palceCategory) => {
			// io.getIO().emit('products', { action: 'update', PlaceCategory: result });
			res
				.status(200)
				.json({ message: 'تم تحديث الصنف بنجاح', palceCategory: palceCategory });
		})
		.catch((err: any) => errorHandler(err, next));
};
export const deletePlaceCategory = (req: Request, res: Response, next: NextFunction) => {
	PlaceCategory.findById(req.params.placeCategoryId)
		.then((PlaceCategory) => {
			if (!PlaceCategory) {
				const err: CustomError = new Error('هذا الصنف غير موجود');
				err.statusCode = 404;
				throw err;
			}
			return PlaceCategory.delete();
		})
		.then(() => {
			// io.getIO().emit('products', { action: 'delete', PlaceCategory: OwnerId });
			res.status(200).json({ message: 'تم حذف الصنف بنجاح' });
		})
		.catch((err) => errorHandler(err, next));
};

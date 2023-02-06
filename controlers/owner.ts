import { Request, Response, NextFunction } from 'express';
import errorHandler from './../helpers/error-handler';

import Owner from '../models/owner';
import { validationResult } from 'express-validator';
import { CustomError, MulterRequest } from './../types/index';
import placeCategory from '../models/place-category';
import clearImage from './../helpers/clear-image';
import Product from '../models/product';

export const getOwners = (req: Request, res: Response, next: NextFunction) => {
	Owner.find()
		.populate('categories')
		.populate('products')
		.populate('placeCategory')
		.then((owners: any[]) => {
			if (!owners) {
				const err: CustomError = new Error('لا يوجد مُلّاك حتى الان');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ owners: owners });
		})
		.catch((err: any) => errorHandler(err, next));
};
export const getOwnerById = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Owner.findById(req.params.ownerId)
		.populate('categories')
		.populate('products')
		.populate('placeCategory')
		.then((owner) => {
			if (!owner) {
				const err: CustomError = new Error('هذا المالك غير موجود');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ owner: owner });
		})
		.catch((err) => errorHandler(err, next));
};
export const createOwner = (
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
	const description = req.body.description;
	const address = req.body.address;
	const categoryIds = req.body.categoryIds.split(',');
	const category = req.body.category;
	const imageUrl = req?.file?.path || '/images/fallback.png';
	Owner.create({
		name,
		description,
		address,
		imageUrl,
		categories: categoryIds,
		placeCategory: category,
		products: [],
	})
		.then(async (owner) => {
			await placeCategory.findByIdAndUpdate(owner.placeCategory._id, {
				$push: { owners: owner },
			});
			res.json({ message: 'تم انشاء المالك بنجاح', owner: owner });
		})
		.catch((err) => errorHandler(err, next));
};
export const updateOwner = (
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
	const description = req.body.description;
	const address = req.body.address;
	const categoryIds = req.body.categoryIds;
	const category = req.body.category;
	let imageUrl = req.body?.image;
	if (req.file) {
		imageUrl = req.file.path;
	}

	Owner.findById(req.params.ownerId)
		.then((owner) => {
			if (!owner) {
				const err: CustomError = new Error('هذا المالك غير موجود');
				err.statusCode = 404;
				throw err;
			}
			// if (imageUrl !== owner.imageUrl) {
			// 	clearImage(owner?.imageUrl || '');
			// }
			owner.name = name;
			owner.description = description;
			owner.address = address;
			owner.categories = categoryIds;
			owner.placeCategory = category;
			owner.imageUrl = imageUrl;
			return owner.save();
		})
		.then((result) => {
			// io.getIO().emit('products', { action: 'update', Owner: result });
			res.status(200).json({ message: 'تم تحديث المالك بنجاح', owner: result });
		})
		.catch((err: any) => errorHandler(err, next));
};
export const deleteOwner = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Owner.findById(req.params.ownerId)
		.then((owner) => {
			if (!owner) {
				const err: CustomError = new Error('هذا المالك غير موجود');
				err.statusCode = 404;
				throw err;
			}
			Product.deleteMany({ owner: owner })
				.then((pro: any) => console.log('delete product', pro._id))
				.catch((err) => console.log(err));
			clearImage(owner?.imageUrl || '');
			return owner.delete();
		})
		.then(() => {
			// io.getIO().emit('products', { action: 'delete', owner: OwnerId });
			res.status(200).json({ message: 'تم حذف المالك بنجاح' });
		})
		.catch((err) => errorHandler(err, next));
};

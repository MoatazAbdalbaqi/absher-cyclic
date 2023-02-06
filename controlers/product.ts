import { Request, Response, NextFunction } from 'express';
import errorHandler from './../helpers/error-handler';

import Product from '../models/product';
import Owner from '../models/owner';
import Category from '../models/category';
import { validationResult } from 'express-validator';
import { CustomError, MulterRequest } from './../types/index';
// import clearImage from './../helpers/clear-image';

export const getProducts = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Product.find()
		.populate("category")
		.then((products: any[]) => {
			if (!products) {
				const err: CustomError = new Error('لا يوجد منتجات حتى الان');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ products: products });
		})
		.catch((err: any) => errorHandler(err, next));
};
export const getProductById = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Product.findById(req.params.productId)
		.populate('owner')
		.populate('category')
		.then((product) => {
			if (!product) {
				const err: CustomError = new Error('المنتج غير موجود');
				err.statusCode = 404;
				throw err;
			}
			return res.status(200).json({ product });
		})
		.catch((err) => errorHandler(err, next));
};
export const createProduct = (
	req: MulterRequest,
	res: Response,
	next: NextFunction
) => {
	const name = req.body.name;
	const description = req.body.description;
	const price = req.body.price;
	const categoryId = req.body.categoryId;
	const ownerId = req.body.ownerId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// @ts-ignore
		const err: CustomError = new Error(errors.array());
		err.statusCode = 442;
		throw err;
	}
	const imageUrl = req?.file?.path || '/images/fallback.png';
	Product.create({
		name,
		description,
		price,
		imageUrl,
		category: categoryId,
		owner: ownerId,
	})
		.then(async (product) => {
			await Owner.findByIdAndUpdate(ownerId, { $push: { products: product } });
			await Category.findByIdAndUpdate(categoryId, {
				$push: { products: product },
			});
			res.json({ massage: 'تم انشاء المنتج بنجاح', product: product });
		})
		.catch((err) => errorHandler(err, next));
};
export const deleteProduct = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Product.findById(req.params.productId)
		.then((product) => {
			if (!product) {
				const err: CustomError = new Error('المنتج غير موجود');
				err.statusCode = 404;
				throw err;
			}
			// clearImage(product.imageUrl);
			return product.delete();
		})
		.then(async (product) => {
			await Owner.findById(product.owner).then((owner) => {
				if (owner?.products) {
					owner.products = owner?.products.filter(
						(item) => item.toString() !== product._id.toString()
					);
				}
				owner?.save();
			});
			await Category.findById(product.category).then((category) => {
				if (category?.products) {
					category.products = category?.products.filter(
						(item) => item.toString() !== product._id.toString()
					);
				}
				category?.save();
			});
		})
		.then(() => {
			// io.getIO().emit('products', { action: 'delete', product: postId });
			res.status(200).json({ message: 'تم حذف المنتج بنجاح' });
		})
		.catch((err) => errorHandler(err, next));
};
export const updateProduct = (
	req: MulterRequest,
	res: Response,
	next: NextFunction
) => {
	const name = req.body.name;
	const description = req.body.description;
	const price = req.body.price;
	const categoryId = req.body.categoryId;
	const ownerId = req.body.ownerId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// @ts-ignore
		const err: CustomError = new Error(errors.array());
		err.statusCode = 442;
		throw err;
	}
	const imageUrl = req?.file?.path || '/images/fallback.png';
	let oldOwnerId: string;
	let oldCategoryId: string;
	Product.findById(req.params.productId)
		.then((product) => {
			if (!product) {
				const err: CustomError = new Error('المنتج غير موجود');
				err.statusCode = 404;
				throw err;
			}
			oldOwnerId = product.owner.toString();
			oldCategoryId = product.category.toString();
			product.name = name;
			product.description = description;
			product.price = price;
			product.imageUrl = imageUrl;
			product.category = categoryId;
			product.owner = ownerId;
			return product.save();
		})
		.then(async (product: any) => {
			if (oldOwnerId !== product.owner.toString()) {
				await Owner.findById(oldOwnerId).then((owner) => {
					if (owner?.products) {
						owner.products = owner?.products.filter(
							(item) => item.toString() !== product._id.toString()
						);
					}
					owner?.save();
				});
				await Owner.findById(product.owner).then((owner) => {
					if (owner?.products) {
						owner.products.push(product._id);
					}
					owner?.save();
				});
			}
			if (oldCategoryId !== product.owner.toString()) {
				await Category.findById(oldCategoryId).then((category) => {
					if (category?.products) {
						category.products = category?.products.filter(
							(item) => item.toString() !== product._id.toString()
						);
					}
					category?.save();
				});
				await Category.findById(product.category).then((category) => {
					if (category?.products) {
						category.products.push(product._id);
					}
					category?.save();
				});
			}
			return product;
		})
		.then((product) => {
			res.json({ massage: 'تم تحديث المنتج بنجاح', product: product });
		})
		.catch((err) => errorHandler(err, next));
};

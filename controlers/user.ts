import { Request, Response, NextFunction } from 'express';
import { User as UserType, CustomError } from './../types/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import errorHandler from './../helpers/error-handler';
import { validationResult } from 'express-validator';
import User from '../models/user';

export const signup = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// @ts-ignore
		const err: CustomError = new Error(errors.array());
		err.statusCode = 442;
		err.data = errors.array();
		throw err;
	}
	const name = req.body.name;
	const phone_no = req.body.phone_no;
	const password = req.body.password;
	const address = req.body.address;
	const location = req?.body?.location || '';
	bcrypt
		.hash(password, 12)
		.then((hashedPass: string) => {
			return new User({
				phone_no,
				name,
				password: hashedPass,
				address: address,
				location,
			}).save();
		})
		.then(() => {
			login(req, res, next);
		})
		.catch((err: any) => errorHandler(err, next));
};

export const login = (req: Request, res: Response, next: NextFunction) => {
	const phone_no = req.body.phone_no;
	const password = req.body.password;
	let loadedUser: UserType;
	return User.findOne({ phone_no: phone_no })
		.then((user: any) => {
			if (!user) {
				const err: CustomError = new Error('هذا المستخدم غير موجود');
				err.statusCode = 401;
				throw err;
			}
			loadedUser = user;
			return bcrypt.compare(password, user.password);
		})
		.then((isMatch: boolean) => {
			if (!isMatch) {
				const err: CustomError = new Error('كلمة مرور خاطئة');
				err.statusCode = 401;
				throw err;
			}
			const token = jwt.sign(
				{ phone_no: loadedUser.phone_no, userId: loadedUser._id.toString() },
				process.env.JWT_KEY + ''
			);
			res.status(200).json({ token, userId: loadedUser._id });
		})
		.catch((err: any) => errorHandler(err, next));
};


import { NextFunction, Response, Request } from 'express';
import User from '../models/user';
import { CustomError } from './../types/index';
import errorHandler from './../helpers/error-handler';
import  jwt  from 'jsonwebtoken';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	const authHead = req.get('Authorization');
	if (!authHead) {
		const err: CustomError = new Error('انت لست ادمن, روح العب بعيد');
		err.statusCode = 401;
		throw err;
	}
	const token = authHead.split(' ')[1];
	let decodedToken:any;
	try {
		// @ts-ignore
		decodedToken = jwt.verify(token, process.env.JWT_KEY);
	} catch (err) {
		errorHandler(err, next);
	}
	User.findById(decodedToken?.userId)
		.then((user: any) => {
			if (user?.isAdmin) {
				return next();
			}
			const err: CustomError = new Error('انت لست ادمن, روح العب بعيد');
			err.statusCode = 404;
			throw err;
		})
		.catch((err: any) => errorHandler(err, next));
};

export default isAdmin;

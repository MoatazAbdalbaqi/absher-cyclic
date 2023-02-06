const jwt = require('jsonwebtoken');
import { NextFunction, Response, Request } from 'express';
import { CustomError } from './../types/index';
import errorHandler from './../helpers/error-handler';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHead = req.get('Authorization');
	if (!authHead) {
		const err: CustomError = new Error('غير مصرح لك بذلك');
		err.statusCode = 401;
		throw err;
	}
	const token = authHead.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_KEY);
	} catch (err) {
		errorHandler(err, next);
	}
	if (!decodedToken) {
		const err: CustomError = new Error('غير مصرح لك بذلك');
		err.statusCode = 401;
		throw err;
	}
	req.params.userId = decodedToken.userId;
	next();
};

export default isAuth;
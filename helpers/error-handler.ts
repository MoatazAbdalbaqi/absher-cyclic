const errorHandler = (error:any, next:any) => {
	error.status = error.statusCode || 500;
	return next(error);
};

export default errorHandler;

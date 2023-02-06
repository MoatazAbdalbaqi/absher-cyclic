const path = require('path');
import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';

import userRouter from './routes/user';
import prouctRouter from './routes/prouct';
import categoryRouter from './routes/category';
import orderRouter from './routes/order';
import ownerRouter from './routes/owner';
import placeCategoryRouter from './routes/place-category';

// const MONGODB_URI = 'mongodb://localhost:27017/absher';
const MONGODB_URI = process.env.PORT;

dotenv.config();

const app: Express = express();

app.use(express.static('./'));

app.use(express.json({ limit: '10mb' }));

// middleware to parse image from POST
const storage = multer.diskStorage({
	destination: function (_: any, _1: any, callback: any) {
		callback(null, 'images');
	},
	filename: function (_: any, file: any, callback: any) {
		callback(null, Date.now() + '-' + file.originalname);
	},
});
const fileFilter = function (req: any, file: any, cb: any) {
	let ext = path.extname(file.originalname);
	if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
		req.fileValidationError = 'Forbidden extension';
		return cb(null, false, req.fileValidationError);
	}
	cb(null, true);
};
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));

// middleware to solve the CROS error
app.use((req: Request, res: Response, next: NextFunction) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	next();
});

// routs
app.use('/auth', userRouter);
app.use('/owner', ownerRouter);
app.use('/category', categoryRouter);
app.use('/place', placeCategoryRouter);
app.use('/product', prouctRouter);
app.use('/order', orderRouter);

// catch errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.log(err);
	res.status(err.statusCode).json({ error: err.message, data: err.data });
});

// conntect to database
mongoose
	.connect(
		'mongodb+srv://Absher_32132:M9PdhY7gZpqZOOuc@cluster0.mzhrv2e.mongodb.net/?retryWrites=true&w=majority'
	)
	.then(() => {
		app.listen(process.env.PORT);
		// const server = app.listen(port);
		// const io = require('./socket').init(server, { cors: { origin: '*' } });
		// io.on('connection', (socket) => {
		// 	console.log('someone connected!');
		// });
		console.log('connected successfully to database');
		module.exports = app;
	})
	.catch((err) => {
		console.log('error while connected to database', err);
		throw err;
	});

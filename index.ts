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
import { S3 } from 'aws-sdk';
import { getFileStream, uploadFile } from './helpers/upload-image';
import multerS3 from 'multer-s3';

const MONGODB_URI = process.env.MONGO_ID!;

dotenv.config();

const app: Express = express();

app.use(express.static('./images'));

app.use(express.json({ limit: '10mb' }));

const s3 = new S3();

// middleware to solve the CROS error
app.use((req: Request, res: Response, next: NextFunction) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	next();
});

// middleware to parse image from POST
// const storage = multer.diskStorage({
// 	destination: function (_: any, _1: any, callback: any) {
// 		callback(null, 'images');
// 	},
// 	filename: function (_: any, file: any, callback: any) {
// 		callback(null, Date.now() + '-' + file.originalname);
// 	},
// });
// const fileFilter = function (req: any, file: any, cb: any) {
// 	let ext = path.extname(file.originalname);
// 	if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
// 		req.fileValidationError = 'Forbidden extension';
// 		return cb(null, false, req.fileValidationError);
// 	}
// 	cb(null, true);
// };

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'some-bucket',
		metadata: function (req: any, file: any, cb: any) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req: any, file: any, cb: any) {
			cb(null, Date.now().toString());
		},
	}),
});

app.post('/upload', upload.array('photos', 3), function (req, res, next) {
	res.send('Successfully uploaded ' + req.files.length + ' files!');
});
// app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
// app.post(
// 	'/upload-image',
// 	multer({ storage: storage, fileFilter: fileFilter }).single('image'),
// 	async (req: Request, res: Response) => {
// 		const file = req.file;
// 		const result = await uploadFile(file);
// 		console.log('result', result);
// 		res.send('OKKKKKKKK');
// 	}
// );
// app.get('/images/:id', (req: Request, res: Response) => {
// 	const key = req.params.id;
// 	const readStream = getFileStream(key);
// 	readStream.pipe(res);
// });

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
mongoose.set('strictQuery', false);
mongoose
	.connect(
		'mongodb+srv://Absher_32132:M9PdhY7gZpqZOOuc@cluster0.mzhrv2e.mongodb.net/?retryWrites=true&w=majority'
	)
	.then(() => {
		app.listen(process.env.PORT);
		console.log('connected successfully to database');
		module.exports = app;
	})
	.catch((err) => {
		console.log('error while connected to database', err);
		throw err;
	});

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

const MONGODB_URI = process.env.MONGO_ID;

dotenv.config();

const app: Express = express();

app.use(express.static('./images'));

app.use(express.json({ limit: '10mb' }));

const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();


// curl -i https://some-app.cyclic.app/myFile.txt
app.get('/*', async (req, res) => {
	let filename = req.path.slice(1);
	try {
		let s3File = await s3
			.getObject({
				Bucket: process.env.BUCKET,
				Key: filename,
			})
			.promise();
		res.set('Content-type', s3File.ContentType);
		res.send(s3File.Body.toString()).end();
	} catch (error) {
		if (error.code === 'NoSuchKey') {
			res.sendStatus(404).end();
		} else {
			res.sendStatus(500).end();
		}
	}
});

app.post('*', async (req,res) => {
  let filename = req.path.slice(1)

  console.log(typeof req.body)

  await s3.putObject({
    Body: JSON.stringify(req.body),
    Bucket: process.env.BUCKET,
    Key: filename,
  }).promise()

  res.set('Content-type', 'text/plain')
  res.send('ok').end()
});

app.put('*', async (req,res) => {
  let filename = req.path.slice(1)

  console.log(typeof req.body)

  await s3.putObject({
    Body: JSON.stringify(req.body),
    Bucket: process.env.BUCKET,
    Key: filename,
  }).promise()

  res.set('Content-type', 'text/plain')
  res.send('ok').end()
});

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
	.connect(MONGODB_URI)
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

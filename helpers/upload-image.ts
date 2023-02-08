import { S3 } from 'aws-sdk';
import fs from 'fs';


const s3 = new S3();

export function uploadFile (file:any) {
	const fileStream = fs.createReadStream(file.path);
	const uploadParams = {
		Bucket: process.env.BUCKET || "",
		Body: fileStream,
		Key: file?.filename,
	};
	return s3.upload(uploadParams).promise()
}

export function getFileStream(fileKey:string) {
	const downloadParams = {
		Key: fileKey,
		Bucket: process.env.BUCKET || '',
	};
	return s3.getObject(downloadParams).createReadStream();
}
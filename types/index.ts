import { ObjectId } from 'mongoose';
import { Request } from 'express';

export interface User {
	_id: ObjectId;
	name: string;
	phone_no: string;
	address: string;
	location?: string;
	password: string;
	orders: Order[];
}

export interface Order {
	_id: ObjectId;
	date: Date;
	user: User;
	isSpecial: Boolean;
	orderMessage: String;
	rejectReson?: String;
	status: 'review' | 'approved' | 'delivered' | 'rejected';
	items: CartItem[];
	location?: string;
}

export interface CartItem {
	quantity?: number;
	product?: Product;
	isSpecial?: Boolean;
	orderMessage?: String;
}

export interface Product {
	_id: ObjectId;
	name: String;
	description: String;
	price: String;
	imageUrl: String;
	owner: Owner;
	category: Category;
}

export interface Owner {
	_id: ObjectId;
	name: String;
	description: String;
	address: String;
	imageUrl: String;
	owner: String;
	productsCategories: Category[];
}

export interface Category {
	_id: ObjectId;
	name: String;
	products: Product[];
}

export interface CustomError extends Error {
	statusCode?: number;
	data?: any;
}

export interface MulterRequest extends Request {
	file: any;
}
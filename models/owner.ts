import mongoose from 'mongoose';
const { Schema } = mongoose;

const ownerSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: false,
		default: '/images/fallback.png',
	},
	placeCategory: {
		type: Schema.Types.ObjectId,
		ref: 'PlaceCategory',
		required: true,
	},
	categories: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
	],
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
});

export default mongoose.model('Owner', ownerSchema);

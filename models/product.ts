import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'Owner',
		required: true,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
});

export  default mongoose.model('Product', productSchema);

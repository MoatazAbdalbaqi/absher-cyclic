import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
});

export default mongoose.model('Category', categorySchema);

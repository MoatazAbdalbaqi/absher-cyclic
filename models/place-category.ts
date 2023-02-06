import mongoose from 'mongoose';
const { Schema } = mongoose;

const placeCategorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	icon: {
		type: String,
		required: true,
	},
	owners: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Owner',
		},
	],
});

export default mongoose.model('PlaceCategory', placeCategorySchema);

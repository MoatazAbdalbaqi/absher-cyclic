import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
	date: {
		type: Date,
		required: true,
	},
	status: {
		type: String,
		required: true,
		default: false,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	isSpecial: {
		type: Boolean,
		required: true,
	},
	orderMessage: {
		type: String,
		required: false,
		default: '',
	},
	location: {
		type: String,
		required: false,
		default: '',
	},
	items: {
		type: [
			{
				product: { type: Object, required: true },
				quantity: { type: Number, required: true },
				message: { type: String, required: false,default:"" },
			},
		],
		required: false,
		default: [],
	},
	rejectReson: {
		type: String,
		required: false,
		default: '',
	},
});

export default mongoose.model('Order', orderSchema);

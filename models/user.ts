const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	phone_no: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: false,
	},
	isAdmin: {
		type: Boolean,
		required: false,
		default: false,
	},
});

export default mongoose.model('User', userSchema);

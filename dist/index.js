"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const user_1 = __importDefault(require("./routes/user"));
const prouct_1 = __importDefault(require("./routes/prouct"));
const category_1 = __importDefault(require("./routes/category"));
const order_1 = __importDefault(require("./routes/order"));
const owner_1 = __importDefault(require("./routes/owner"));
const place_category_1 = __importDefault(require("./routes/place-category"));

const MONGODB_URI = process.env.MONGO_ID;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.static('./'));
app.use(express_1.default.json({ limit: '10mb' }));
// middleware to parse image from POST
const storage = multer_1.default.diskStorage({
    destination: function (_, _1, callback) {
        callback(null, 'images');
    },
    filename: function (_, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    },
});
const fileFilter = function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        req.fileValidationError = 'Forbidden extension';
        return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
};
app.use((0, multer_1.default)({ storage: storage, fileFilter: fileFilter }).single('image'));
// middleware to solve the CROS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});
// routs
app.use('/auth', user_1.default);
app.use('/owner', owner_1.default);
app.use('/category', category_1.default);
app.use('/place', place_category_1.default);
app.use('/product', prouct_1.default);
app.use('/order', order_1.default);
// catch errors
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode).json({ error: err.message, data: err.data });
});
// conntect to database
mongoose_1.default
	.connect(MONGODB_URI)
	.then(() => {
		app.listen(process.env.PORT);
		console.log('connected successfully to database');
		module.exports = app;
	})
	.catch((err) => {
		console.log('error while connected to database', err);
		throw err;
	});

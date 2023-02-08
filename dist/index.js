"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const aws_sdk_1 = require("aws-sdk");
const upload_image_1 = require("./helpers/upload-image");
const MONGODB_URI = process.env.MONGO_ID;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.static('./images'));
app.use(express_1.default.json({ limit: '10mb' }));
const s3 = new aws_sdk_1.S3();
// middleware to solve the CROS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});
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
// app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.post('/upload-image', (0, multer_1.default)({ storage: storage, fileFilter: fileFilter }).single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const result = yield (0, upload_image_1.uploadFile)(file);
    console.log('result', result);
    res.send('OKKKKKKKK');
}));
app.get('/images/:id', (req, res) => {
    const key = req.params.id;
    const readStream = (0, upload_image_1.getFileStream)(key);
    readStream.pipe(res);
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
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect('mongodb+srv://Absher_32132:M9PdhY7gZpqZOOuc@cluster0.mzhrv2e.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
    app.listen(process.env.PORT);
    console.log('connected successfully to database');
    module.exports = app;
})
    .catch((err) => {
    console.log('error while connected to database', err);
    throw err;
});

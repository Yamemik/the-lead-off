import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';

import {
   UserController, OrderController, RegionController, CategoryController, RateController, SettingController,
   NumberController, UkassaController, PaymentController
} from './controllers/index.js';

import { registerValidation, loginValidation, updateValidation, resentPassValidation, transValidation } from './validations/AdminValidation.js';
import { createRegionValidation, createValidationIndexes, createCategoryValidation } from './validations/SettingsValidation.js';
import { createOrderValidation, updateOrderValidation, findDublicateOrderValidation, getAllForUserWithFilterValidation, reportOrderValidation } from './validations/OrderValidation.js';
import { checkAuth, checkAuthIsAdmin, handlValidationErrors, handlers, handlers_payment } from './utils/index.js';


//connect db
const string_connect_beget = process.env.STRINGCONNECT;
mongoose.connect(string_connect_beget)
   .then(() => console.log('db.....ok!!'))
   .catch((err) => console.log('db ERROR:', err));

const app = express();  //create webapp
const router = express.Router();
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'));
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads')
   },
   filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
   }
});
const maxFieldSize = 15 * 1024 * 1024;
const uploads = multer(
   { storage },
   { limits: { fieldSize: maxFieldSize } }
);

app.use(express.json());   //add can read .json
app.use(cors());
app.use(handlers);
app.use("/api", router);
app.use('/uploads', express.static('uploads'));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/", express.static("../frontend"));


//AUTH
router.post('/auth/reg', checkAuthIsAdmin, registerValidation, handlValidationErrors, UserController.createUser);
router.post('/auth/log', loginValidation, handlValidationErrors, UserController.log_in);

//ADMIN
//users
router.get('/admin/user/:id', checkAuthIsAdmin, UserController.getUserByID);
router.get('/admin/user', checkAuthIsAdmin, UserController.getUsers);
router.patch('/admin/user/:id', checkAuthIsAdmin, updateValidation, handlValidationErrors, UserController.update);
router.delete('/admin/user/:id', checkAuthIsAdmin, UserController.removeUser);
//orders
router.get('/admin/order', checkAuth, OrderController.getAll);
router.post('/admin/order', checkAuthIsAdmin, createOrderValidation, handlValidationErrors, OrderController.createOrder);
router.post('/admin/order/filter', checkAuthIsAdmin, getAllForUserWithFilterValidation, handlValidationErrors, OrderController.getAllWithFilter);
router.patch('/admin/order/:id', checkAuthIsAdmin, updateOrderValidation, handlValidationErrors, OrderController.updateOrder);
router.delete('/admin/order', checkAuthIsAdmin, OrderController.removeMany);
router.delete('/admin/order/:id', checkAuthIsAdmin, OrderController.remove);
router.post('/admin/order/finddublicate', checkAuthIsAdmin, findDublicateOrderValidation, handlValidationErrors, OrderController.findDublicate);
router.post('/admin/uploads', checkAuthIsAdmin, uploads.array('file', 11), OrderController.cpUpload);
router.patch('/admin/order/refund/:order_id', checkAuth, OrderController.refund);
router.patch('/admin/order/canceled/:order_id', checkAuth, OrderController.cancelIsCanceled);
//report
router.post('/admin/report/user', checkAuthIsAdmin, reportOrderValidation, handlValidationErrors, OrderController.report_user);
router.post('/admin/report/category', checkAuthIsAdmin, OrderController.report_category);
//payment
router.get('/admin/ukassa/getall', checkAuthIsAdmin, PaymentController.getAllPayAllUsers);

//SETTING
//region
router.post('/admin/settings/region', checkAuthIsAdmin, createRegionValidation, handlValidationErrors, RegionController.createRg);
router.patch('/admin/settings/region/:id', checkAuthIsAdmin, createRegionValidation, handlValidationErrors, RegionController.updateRg);
router.delete('/admin/settings/region/:id', checkAuthIsAdmin, RegionController.removeRg);
router.delete('/admin/settings/region', checkAuthIsAdmin, RegionController.removeManyRg);
//category
router.post('/admin/settings/category', checkAuthIsAdmin, createCategoryValidation, handlValidationErrors, CategoryController.createCt);
router.patch('/admin/settings/category/:id', checkAuthIsAdmin, createCategoryValidation, handlValidationErrors, CategoryController.updateCt);
router.delete('/admin/settings/category/:id', checkAuthIsAdmin, CategoryController.removeCt);
router.delete('/admin/settings/category', checkAuthIsAdmin, CategoryController.removeManyCt);
//score and more indexes
router.post('/admin/settings/score', checkAuthIsAdmin, createValidationIndexes, handlValidationErrors, RateController.createSc);
router.delete('/admin/settings/score', checkAuthIsAdmin, RateController.removeManySc);
router.delete('/admin/settings/score/:id', checkAuthIsAdmin, RateController.removeSc);
router.patch('/admin/settings/score/:id', checkAuthIsAdmin, createValidationIndexes, handlValidationErrors, RateController.updateSc);
//settings
router.post('/admin/settings/setting', checkAuth, SettingController.createSt);
router.get('/admin/settings/setting', SettingController.getAllSt);
router.patch('/admin/settings/setting', checkAuth, SettingController.updateSt);
router.delete('/admin/settings/setting', checkAuth, SettingController.removeSt);
//about
router.post('/admin/settings/about', checkAuthIsAdmin, SettingController.createAb);
router.patch('/admin/settings/about', checkAuthIsAdmin, SettingController.updateAb);

//USER
router.get('/user/me', checkAuth, UserController.getMe);
router.patch('/user/transaction', checkAuth, transValidation, handlValidationErrors, UserController.transaction);
router.post('/user/resentpass', resentPassValidation, handlValidationErrors, UserController.resentPassword);
//ukassa
router.post('/user/me/ukassa', checkAuth, UkassaController.payment);
router.post('/user/me/ukassa/getpayment/', checkAuth, UkassaController.getPayment);
//payment
router.get('/user/me/ukassa/getall', checkAuth, handlers_payment, PaymentController.getAllPay);
//order
router.get('/user/order/:id', checkAuth, OrderController.getOne);
router.get('/user/order', checkAuth, OrderController.getAllForUser);
router.get('/user/orders/all', checkAuth, OrderController.getAllUser);
router.get('/user/orders/all/issale', checkAuth, OrderController.getAllisSale);
router.post('/user/order/buyorder/:id', checkAuth, OrderController.buyOrder);
router.post('/user/orders/filter', checkAuth, getAllForUserWithFilterValidation, handlValidationErrors, OrderController.getAllForUserWithFilter);
router.patch('/user/order/setIsArchive/:id', checkAuth, OrderController.setIsArchive);
router.patch('/user/order/sendCancel/:id', checkAuth, OrderController.sendCancel);
//settings
router.get('/admin/settings/region/:id', RegionController.getOneRg);
router.get('/admin/settings/region', RegionController.getAllRg);
router.get('/admin/settings/category/:id', CategoryController.getOneCt);
router.get('/admin/settings/category', CategoryController.getAllCt);
router.get('/admin/settings/score/', RateController.getOneSc);
router.get('/admin/settings/about', SettingController.getAllAb);


//PROGER
//number order
router.get('/admin/numberorder', checkAuthIsAdmin, NumberController.getAllNo);
router.post('/admin/numberorder', checkAuthIsAdmin, NumberController.createNo);
router.get('/admin/number_user', checkAuthIsAdmin, NumberController.GetNumberUser);
router.post('/admin/number_user', checkAuthIsAdmin, NumberController.CreateUserNumber);

app.use('*', (req, res) => {
   res.sendFile("/var/www/frontend/index.html");
});

//run server
app.listen(3000, (err) => {
   if (err) {
      return (err);
   }
   console.log('webserver.....OK!');
});
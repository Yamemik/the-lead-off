import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';

import { UserController, OrderController, RegionController, CategoryController, RateController } from './controllers/index.js';

import { registerValidation, loginValidation, updateValidation, resentPassValidation } from './validations/AdminValidation.js';
import { createRegionValidation, createValidationIndexes, createGroupValidation, createCategoryValidation } from './validations/SettingsValidation.js';
import { createOrderValidation, updateOrderValidation, findDublicateOrderValidation } from './validations/OrderValidation.js';
import { checkAuth, checkAuthIsAdmin, handlValidationErrors, handlers } from './utils/index.js';

//connect db
mongoose.connect('mongodb+srv://admin:admin@cluster0.532y6ot.mongodb.net/lead-off?retryWrites=true&w=majority')
   .then(() => console.log('db.....ok!!'))
   .catch((err) => console.log('db ERROR:', err));

const app = express();  //create webapp
const router = express.Router();
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'));
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads');
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname);
   }
});
const uploads = multer({ storage });

app.use(express.json());   //add can read .json
app.use(cors());
app.use(handlers);
app.use("/api", router);
app.use('/uploads', express.static('uploads'));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.get('/', (req, res) => {
   res.send('test of lead-off');
});

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
router.patch('/admin/order/:id', checkAuthIsAdmin, updateOrderValidation, handlValidationErrors, OrderController.updateOrder);
router.delete('/admin/order', checkAuthIsAdmin, OrderController.removeMany);
router.delete('/admin/order/:id', checkAuthIsAdmin, OrderController.remove);
router.post('/admin/order/finddublicate', checkAuthIsAdmin, findDublicateOrderValidation, handlValidationErrors, OrderController.findDublicate);
router.post('/admin/uploads', checkAuthIsAdmin, uploads.single('file'), OrderController.cpUpload);

//SETTING
//region
router.post('/admin/settings/region', checkAuthIsAdmin, createRegionValidation, handlValidationErrors, RegionController.createRg);
router.get('/admin/settings/region/:id', checkAuthIsAdmin, RegionController.getOneRg);
router.get('/admin/settings/region', checkAuthIsAdmin, RegionController.getAllRg);
router.patch('/admin/settings/region/:id', checkAuthIsAdmin, createRegionValidation, handlValidationErrors, RegionController.updateRg);
router.delete('/admin/settings/region/:id', checkAuthIsAdmin, RegionController.removeRg);
router.delete('/admin/settings/region', checkAuthIsAdmin, RegionController.removeManyRg);
//category
router.post('/admin/settings/category', checkAuthIsAdmin, createCategoryValidation, handlValidationErrors, CategoryController.createCt);
router.get('/admin/settings/category/:id', checkAuthIsAdmin, CategoryController.getOneCt);
router.get('/admin/settings/category', checkAuthIsAdmin, CategoryController.getAllCt);
router.patch('/admin/settings/category/:id', checkAuthIsAdmin, createCategoryValidation, handlValidationErrors, CategoryController.updateCt);
router.delete('/admin/settings/category/:id', checkAuthIsAdmin, CategoryController.removeCt);
router.delete('/admin/settings/category', checkAuthIsAdmin, CategoryController.removeManyCt);
//score and more indexes
router.post('/admin/settings/score', checkAuthIsAdmin, createValidationIndexes, handlValidationErrors, RateController.createSc);
router.get('/admin/settings/score/:id', checkAuthIsAdmin, RateController.getOneSc);
router.delete('/admin/settings/score', checkAuthIsAdmin, RateController.removeManySc);
router.delete('/admin/settings/score/:id', checkAuthIsAdmin, RateController.removeSc);
router.patch('/admin/settings/score/:id', checkAuthIsAdmin, createValidationIndexes, handlValidationErrors, RateController.updateSc);


//USER
router.get('/user/me', checkAuth, UserController.getMe);
router.post('/user/resentpass', resentPassValidation, handlValidationErrors, UserController.resentPassword);
//order
router.get('/user/order/:id', checkAuth, OrderController.getOne);
router.get('/user/order', checkAuth, OrderController.getAllForUser);
router.get('/user/order/adduser/:id', checkAuth, OrderController.addUser);
router.patch('/user/order/setIsArchive/:id', checkAuth, OrderController.setIsArchive);
router.patch('/user/order/sendCancel/:id', checkAuth, OrderController.sendCancel);





//run server
app.listen(7777, (err) => {
   if (err) {
      return (err);
   }
   console.log('webserver.....OK!');
});
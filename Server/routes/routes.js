const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const productController = require('../controllers/productController');
const pdfController = require('../controllers/pdfController');
const jwtCheck = require('../Utils/jwtUtils');

// User routes
router.post('/signUp', userController.postUser);
router.post('/signin', userController.Singin);
router.put('/updateUser/:id', jwtCheck.jwtCheck, userController.updateUser);
router.delete('/deleteUser/:id', jwtCheck.jwtCheck, userController.deleteUser);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);

// Product routes
router.post('/addProduct', jwtCheck.jwtCheck, productController.addProduct);
router.get('/getProducts', jwtCheck.jwtCheck, productController.getProducts);
router.put('/updateProduct/:id', jwtCheck.jwtCheck, productController.updateProduct);
router.delete('/deleteProduct/:id', jwtCheck.jwtCheck, productController.deleteProduct);

// Define your route handler
router.get('/generate', jwtCheck.jwtCheck, pdfController.createPDF);

module.exports = router;

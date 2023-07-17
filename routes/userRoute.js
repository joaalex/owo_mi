const routes = require('express').Router();
const {createUser, verifyUserWithOtp, loginUser, getUserProfile} = require('../controllers/userController');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');

routes.post('/signup', createUser);
routes.patch('/verify/:email/:otp', verifyUserWithOtp);
routes.get('/login', loginUser);
routes.get('/profile', authentication, authorization, getUserProfile);


module.exports = routes

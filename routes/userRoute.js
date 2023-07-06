const routes = require('express').Router();
const {createUser, verifyUserWithOtp, loginUser} = require('../controllers/userController');

routes.post('/signup', createUser);
routes.patch('/verify/:email/:otp', verifyUserWithOtp);
routes.get('/login', loginUser);


module.exports = routes
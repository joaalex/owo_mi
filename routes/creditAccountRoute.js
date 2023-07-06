const routes = require('express').Router();
const {creditAccount} = require('../controllers/walletController');

routes.post('/credit', creditAccount );



module.exports = routes;
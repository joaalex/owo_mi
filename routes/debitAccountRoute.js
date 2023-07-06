const routes = require('express').Router();
const {debitAccount} = require('../controllers/walletController');

routes.post('/debit', debitAccount );



module.exports = routes;
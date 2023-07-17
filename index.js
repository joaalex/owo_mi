require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT;
const sequelize = require('./config/db');
const user = require('./models/userModel');
const otp = require('./models/otpModel');
const wallet = require('./models/walletModel');
const transaction = require('./models/transactionModel');
const complaint = require('./models/compliantModel');
const Faq = require('./models/faqModel');
const {notFoundMessage} = require('./constants/message');
const displayRoute = require('express-routemap');
const userRoutes = require('./routes/userRoute');
const creditAccountRoute = require('./routes/creditAccountRoute');
const debitAccountRoute = require('./routes/debitAccountRoute');
const complainRoute = require('./routes/complainLogRoute');
const transactionRoute = require('./routes/getTransactionRoute');
const faqRoute = require('./routes/faqRoute');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/credit-account', creditAccountRoute);
app.use('/api/v1/debit-account', debitAccountRoute);
app.use('/api/v1/complains', complainRoute );
app.use('/api/v1/transactions', transactionRoute);
app.use('/api/v1/faq', faqRoute);

sequelize.sync()
.then( result => console.log('Model synced.'))
.catch(error => console.error(`${error} : Error syncing`));

sequelize.authenticate()
.then(result => {
  console.log("Database Connection established");
  app.listen(port, ()=>{
    console.log(`listening on ${port}`);
    displayRoute(app);
  });

})
.catch(err =>{
  console.log("Server error")
});


app.use((req,res)=>{
  res.status(400).json({
    status: 'false',
    message: notFoundMessage
  });
});
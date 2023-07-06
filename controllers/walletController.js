const walletModel = require('../models/walletModel');
const transactionModel = require('../models/transactionModel');
const { v4: uuidv4 } = require('uuid');
const {transactionTypeEnum, transactionStatusEnum} = require('../constants/enums');
const {creditAccountValidation, debitAccountValidation} = require('../validations/transactionValidation')


const creditTransaction = async (amountRecieved, userId, comment) =>{
  const amount = Number(amountRecieved);
  const userInfo = await getUserInfo(userId);
  if(userInfo === null){
    return null;
  };

  const oldBalance = Number(userInfo.amount_after);
  const newBalance = Number(oldBalance + amount);
  await updateWallet(userId, oldBalance , newBalance);
  await transaction(userId, transactionTypeEnum.CREDIT, amountRecieved, comment, transactionStatusEnum.COMPLETED);
  return;
};


const debitTransaction = async(amountSent, userId, comment )=>{
  const amount = Number(amountSent);
  const userInfo = await getUserInfo(userId);
  if(userInfo === null){
    // what if we wanna take care of non existing user;
    return null;
  };
  const oldBalance = Number(userInfo.amount_after);
  if( amount > oldBalance){
    return false;
  };
  const newBalance = oldBalance - amount;
  await updateWallet(userId, oldBalance, newBalance);
  await transaction(userId, transactionTypeEnum.DEBIT, amountSent, comment, transactionStatusEnum.COMPLETED);
  return true;
};


const getUserInfo = (userId)=>{
  return walletModel.findOne({
    where : {
      userId : userId
    }
  });
};

const updateWallet = (userId, oldBalance, newBalance) => {
  return walletModel.update(
    {
      amount_before : oldBalance,
      amount_after : newBalance
    },
    {
      where : {
        userId : userId
      }
    }
  );
};

const transaction = (userId, type, amount, comment, transactionStatus)=>{
  return transactionModel.create({
    transaction_id: uuidv4(),
    userId: userId,
    transaction_type: type,
    amount: amount,
    comments: comment,
    transaction_status: transactionStatus
  });
};

const creditAccount = async (req,res)=>{

  const {userId, amount, comment} = req.body;
  // if()
  creditAccountValidation(req.body);
  if(error !== undefined){
    res.status(404).json({
      status: false,
      message: error.details[0].message
    });
    return;
  };

  const creditRes = await creditTransaction(amount, userId, comment);
  if(creditRes === null){
    res.status(200).json({
      status: true,
      message: "This user does not exit"
    });
    return;
  };

  res.status(200).json({
    status: true,
    message: 'Account creadited successfully'
  });
};

const debitAccount = async (req, res)=>{

  const {userId, amount, comment} = req.body;
  debitAccountValidation(req.body);
  if(error !== undefined){
    res.status(404).json({
      status: false,
      message: error.details[0].message
    });
    return;
  };

  const debitRes =  await debitTransaction(amount, userId, comment);
  if(debitRes === false){
    res.status(200).json({
      status: true,
      message: 'Insufficient funds'
    });
    return;
  } else if(debitRes === null){
    
    res.status(200).json({
      status: true,
      message: "This user does not exit"
    });
    return;
  };

  res.status(200).json({
    status: true,
    message: 'Account debited successfully'
  });
}



module.exports ={
                creditTransaction,
                debitTransaction,
                creditAccount,
                debitAccount
};


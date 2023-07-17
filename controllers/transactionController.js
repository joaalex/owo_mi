const {Op} = require('sequelize');
const transactionModel = require('../models/transactionModel');
const {transactionTypeEnum} = require('../constants/enums');



const getTransactions = async (req, res)=>{

  try{
    const { page } = req.query
    const limit = 5;
    const pages = (page - 1) || 0;
    const offset = pages * limit;

    const getAllTransactions = await getAllTransaction(limit, offset);

    res.status(200).json({
    status: true,
    message: 'Transaction logged successfully',
    data: getAllTransactions
  });

  } catch(error){

    res.status(500).json({
      status: false,
      message: error.message
    });

  }
};

const filterTransactionsWithDate = async (req, res)=>{

  try{

    const {startDate, endDate} = req.query;
    
    if(!startDate || !endDate) throw new Error('Fill all fields', 400)
   
    const start = new Date(startDate);
    const end = new Date(endDate);

    const getAllTransactionsViaDate = await getAllTransactionViaDate(start, end);

    if(getAllTransactionsViaDate.length < 1) throw new Error('No transactions during this period.', 400);

    res.status(200).json({
    status: true,
    message: 'Transaction logged successfully',
    data: getAllTransactionsViaDate
  });

  } catch(error){

    res.status(500).json({
      status: false,
      message: error.message
    });

  };
};

const filterTransaction = async (req, res)=>{

  try{

    const {filter_by} = req.query;
    let amount = filter_by;

    if(filter_by === transactionTypeEnum.CREDIT){

      const creditTransactions = await getTransactionsViaCredit(transactionTypeEnum);

      res.status(200).json({
        status: true,
        message: 'All credit transactions logged successfully',
        data: creditTransactions
      });

    } else if(filter_by === transactionTypeEnum.DEBIT){

      const debitTransactions = await getTransactionsViaDebit(transactionTypeEnum);

      res.status(200).json({
        status: true,
        message: 'All debit transactions logged successfully',
        data: debitTransactions
      });

    } else if(filter_by === amount){

      const transactionAmount = await getTransactionsViaAmount(amount)

      if(transactionAmount.length < 1) throw new Error('No transaction.', 400)

      res.status(200).json({
        status: true,
        message: 'All credit transactions logged successfully',
        data: transactionAmount
      });
      
    };

  }catch(error){
    res.status(500).json({
      status: false,
      message: error.message
    });
  };
};


const getTransactionsViaCredit = (transactionTypeEnum) =>{
  return transactionModel.findAll({
    where: {
      transaction_type: transactionTypeEnum.CREDIT
    },
    order:[['sn']]
  });
};


const getTransactionsViaDebit = (transactionTypeEnum) =>{
  return transactionModel.findAll({
    where: {
      transaction_type: transactionTypeEnum.DEBIT
    },
    order:[['sn']]
  });
};


const getTransactionsViaAmount = (amount) =>{
  return transactionModel.findAll({
        
    where: {
      amount: amount
    },
    order:[['sn']]
  });

}


const getAllTransactionViaDate = (start, end)=>{
  return transactionModel.findAll(
    {
      where:{
        createdAt: {[Op.between] : [start, end]}
    },
    order:[['sn']]
  }
  // {limit:5}
   );
}


const getAllTransaction = (limit, offset)=>{
  return transactionModel.findAll(
    {
      order:[['sn']],
      limit: limit,
      offset: offset,
    }
   );
}
 

module.exports = {  getTransactions,
                    filterTransaction,
                    filterTransactionsWithDate
};
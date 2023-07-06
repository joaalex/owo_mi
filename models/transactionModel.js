const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('transactions',{
  sn:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  transaction_id:{
    type : DataTypes.UUID,
    allowNull : false,
    primaryKey : true
  },
  userId : {
    type : DataTypes.UUID,
    allowNull : false,
  },
  transaction_type : {
    type : DataTypes.ENUM,
    values : [ 'credit', 'debit'],
    allowNull : false
  },
  amount : {
    type : DataTypes.DOUBLE(10,2),
    allowNull : false,
  },
  comments : {
    type: DataTypes.TEXT,
    allowNUll: true
  },
  transaction_status : {
    type: DataTypes.ENUM,
    values : ['completed', 'failed', 'pending', 'rollover'],
    allowNull : false
  }
})

module.exports = Transaction;
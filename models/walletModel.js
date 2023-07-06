const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');


const Wallet = sequelize.define('wallets',{
  sn:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  walletId:{
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  userId:{
    type: DataTypes.UUID,
    allowNull: false
  },
  amount_before:{
    type: DataTypes.DOUBLE(10,2),
    allowNull: false,
    defaultValue: 0
  },
  amount_after:{
    type: DataTypes.DOUBLE(10,2),
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = Wallet;



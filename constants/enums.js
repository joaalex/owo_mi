const otpEnum = {
  REGISTRATION: 0,
  PASSWORD_RESET: 1
};

const transactionTypeEnum = {
  CREDIT: 'credit',
  DEBIT: 'debit'
};

const transactionStatusEnum = {
  COMPLETED: 'completed',
  FAILED: 'failed',
  PENDING: 'pending',
  ROLLOVER: 'rollover'
};



module.exports = {
                    otpEnum,
                    transactionTypeEnum,
                    transactionStatusEnum
};


const Joi = require('joi');

const creditAccountValidation = (data)=>{
  const creditAccountSchema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.string().required(),
    comment: Joi.string().required()
  });
  return {error} = creditAccountSchema.validate(data);
};

const debitAccountValidation = (data)=>{
  const debitAccountSchema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.string().required(),
    comment: Joi.string().required()
  });
  return {error} = debitAccountSchema.validate(data);
};

module.exports = {
                  creditAccountValidation,
                  debitAccountValidation
};
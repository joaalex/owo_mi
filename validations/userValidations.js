const Joi = require('joi');

const createUserValidation = (data)=>{
  const createUserSchema = Joi.object({
    surname: Joi.string().required(),
    othernames: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    repeat_password: Joi.ref('password'),
    dob: Joi.date().required(),
    phone: Joi.string().required(),
    gender: Joi.string().required(),
  });
  return {error, value} = createUserSchema.validate(data);
};

const loginUserValidation = (data) =>{
  const loginUserSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  });
  return {error, value} = loginUserSchema.validate(data);
};

module.exports = {
                    createUserValidation,
                    loginUserValidation
};
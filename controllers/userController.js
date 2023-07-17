const {createUserValidation, loginUserValidation} = require('../validations/userValidations');
const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const walletModel = require('../models/walletModel');
const {Op} = require('sequelize');
const {v4: uuidv4} = require('uuid');
const {passwordHash, generateOtp, comparePassword, otpValidity} = require('../utils/userHelpers');
const {sendEmail} = require('../services/sendEmail');
const {otpEnum} = require('../constants/enums');
const {userExist, welcomeMes, serverError, badReq, accVerified, invalidOtp, expiredOtp} = require('../constants/message');
const {creditTransaction, debitTransaction} = require('../controllers/walletController');
const jwt = require('jsonwebtoken');


const createUser = async (req, res)=>{

  createUserValidation(req.body);

  if( error !== undefined){
    res.status(400).json({
      status: false,
      message: error.details[0].message || "Bad request"
    });
    return;
  };

  try{
    const {surname, othernames, email, password, dob, phone, gender} = req.body;

    const ifUserAlreadyExists = await userModel.findAll({ 
                attributes:['email', 'phone'],
                where:{
                  [Op.or]:[
                    {
                      email: email,
                      phone: phone
                    }
                  ]
                }
    });

    if( ifUserAlreadyExists.length > 0){
      res.status(400).json({
        status: false,
        message: userExist
      })
      return;
    };

    const {salt, hash} = await passwordHash(password);
    delete req.body.password
    req.body.userId = uuidv4();
    req.body.password_hash = hash;
    req.body.password_salt = salt;

    await userModel.create(req.body);
    const {userId} = req.body;

    await walletModel.create({
      walletId: uuidv4(),
      userId: userId

    });

    // await debitTransaction(3000, userId, 'Give Away...' );
    // await creditTransaction(3000, userId, 'Give Away...' )

    const otp = generateOtp(6);

    await otpModel.create({
      otp_id : uuidv4(),
      otp: otp,
      email_phone : email,
    });

    // sendEmail(email, "OTP Verification", `Hi ${surname}, your otp is ${otp}, its valid for only 5 minutes.` )

    res.status(201).json({
      status: true,
      message: welcomeMes
    });

  }catch(error){
    console.log(error)
    res.status(500).json({
      status: false,
      message: error.message || serverError
    });
  };
};

const verifyUserWithOtp = async (req, res) => {
  const {email, otp} = req.params;

  try{

    if(!email || !otp){
      res.status(404).json({
        status: false,
        message: badReq
      });
      return;
    };

    const otpData = await otpModel.findOne({
      where:{
        email_phone : email,
        otp: otp,
        otp_type: otpEnum.REGISTRATION
      }
    });
    
    if(!otpData){
      res.status(404).json({
        status: false,
        message: invalidOtp
      });
      return;
    };
    
    const otpTimeDiff = otpValidity(otpData.createdAt);

    if(otpTimeDiff > 5 ){
      res.status(404).json({
        status: false,
        message: expiredOtp
      });
      return;
    };

    
    await userModel.update({
        isOtpVerified : true
      },
        {
        where:{
          email: email
        }
      }
    );
    await otpModel.destroy({
      where:{
        email_phone: email,
        otp_type: otpEnum.REGISTRATION
      }
    });

    res.status(200).json({
      status: true,
      message: accVerified
    });

  } catch(error){
    res.status(500).json({
      status: false,
      message: error.message || serverError
    });
  };
};

const loginUser = async (req, res) =>{
  const {email, password} = req.body;

   loginUserValidation(req.body);

   if(error !== undefined) {
    console.error(error)
    res.status(404).json({
      status: false,
      message: error.details[0].message
    });
    return;
   };

  try{

    const getFromDB = await userModel.findOne({
      attributes: ['email', 'password_hash', 'password_salt'],
      where:{
        email : email
      }
    });

    if(getFromDB === null ){
      res.status(401).json({
        status : false,
        message : 'Invalid password or email'
      })
      return;
    };
    
    const DBhash = getFromDB.password_hash;
    const DBsalt = getFromDB.password_salt;
    const DBemail = getFromDB.email;

    // const DBhash = getFromDB[0].dataValues.password_hash;
    // const DBsalt = getFromDB[0].dataValues.password_salt;
    
    const gethash = await comparePassword(password, DBsalt);
    const hash = gethash.hash;

    const payloadData = {
      email: email,
      _id: uuidv4()
    }

    if(DBhash !== hash || DBemail != email ) throw new Error('Invalid password or email', 400);
  
    
    const userInfo = await userModel.findOne({
      where:{
        [Op.and]:[
            {email: email},
            {password_hash: hash}
        ]
      }
    });

    const token = jwt.sign(payloadData, process.env.JWT_SECRET_KEY, {expiresIn : '1h'});

    res.status(200).json({
      status : true,
      message : "Login successful",
      token : token,
      data: [
        { userId: userInfo.userId, 
          email: userInfo.email, 
          surname: userInfo.surname, 
          othernames: userInfo.othernames, 
          email: userInfo.email, 
          phone: userInfo.phone, 
          gender: userInfo.gender
        }
      ]
    });

  
  } catch( error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: error.message || serverError
    });
  };

};

const getUserProfile = async (req, res) => {
  try{
    const {user} = req.params;

    if(!user) throw new Error('An important Credential is missing', 400);

    const getUser = await userModel.findOne({
      attributes: ["userId", "surname", "othernames", "email", "phone", "gender", "dob", "marital_status"],
      where:{ userId: user}
    });

    if(!getUser) throw new Error('No profile found.', 400);

    res.status(200).json({
      status: true,
      message: "Your Profile",
      data: getUser
    });
    
  }catch(e){
    console.log(e);
    res.status(500).json({
      status: false,
      message: e.message || serverError
    })
  }

};




module.exports = {
                  createUser,
                  verifyUserWithOtp,
                  loginUser,
                  getUserProfile
};


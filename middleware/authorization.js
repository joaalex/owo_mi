const UserModel = require('../models/userModel');

const authorization = async (req, res, next) =>{
   
  const userEmail = req.params.userEmail;

  if(!userEmail){
    res.status(401).json({
      status: false,
      message: "Unauthorized Access"
    });
    return;
  };

  const userData = await UserModel.findOne({ where: {email : userEmail}});

  if(!userData){
    res.status(401).json({
      status: false,
      message: "Unauthorized Access"
    });
    return;
  };

  req.params.user = userData.userId;
  next()
};

module.exports = authorization;
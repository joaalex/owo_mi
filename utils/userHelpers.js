const bcrypt = require('bcrypt');
const saltRounds = 10

const passwordHash = (password)=>{
  return new Promise((res, rej)=>{
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
          res({
            salt: salt, 
            hash: hash
          })
      });
    });
  });
};


const comparePassword = (password, salt) => {
  return new Promise((res, rej)=>{
    bcrypt.hash(password, salt, (err, hash) => {
        res({
          hash: hash
        })
    });
  });
};    
  

const otpValidity = (otpCreated) =>{
    const timeDiff = new Date() - new Date(otpCreated);
    const otpTimeDiff = Math.ceil(timeDiff / 60000);
    return otpTimeDiff;
};

const generateOtp = (num)=>{
  const numCal = Math.pow(10, num-1)
  const otp = Math.floor(numCal + Math.random() * 9 * numCal );
  console.log(otp);
  return otp;
};


module.exports = {
                  passwordHash,
                  generateOtp,
                  comparePassword,
                  otpValidity
};




// const comparePassword = (password, hash) => {
//   bcrypt.compare(password, hash).then(function(result) {
    
//   })
// }  
// const geOtp = ()=>{
//   Math.floor(100000 + Math.random() * 900000)
// }                 
require('dotenv').config();
const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET_KEY;

const authentication = (req, res, next)=>{
  const {authorization} = req.headers;

    console.log("Here " + authorization);
    
  if(!authorization) {
    res.status(401).json({
      status: false,
      message: "Unauthorized Access"
    });

  } else {
    
    const splitAuth = authorization.split(" ");
    console.log(splitAuth);

    jwt.verify(splitAuth[1], process.env.JWT_SECRET_KEY, (err, decoded)=>{
      if(err){
        res.status(401).json({
          statu: false,
          message: err.message
        });
      };
      console.log(decoded);
      req.params.userEmail = decoded.email;
      next();
    });
  }

  

};

module.exports = authentication;

//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFkZUtlbXNAeWFob28uY29tIiwiX2lkIjoiMWM3MTA1MDEtYTA0ZS00ZGNjLTlkMTUtY2JkOTQzMTMzNzY5IiwiaWF0IjoxNjg5NTMzMDg2LCJleHAiOjE2ODk1MzY2ODZ9.akrU2Jk9PUlnIvd3giDDlOmsZF0NSDzcgz3_b0hrRis"

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFkcnVpbG9pbkB5YWhvby5jb20iLCJfaWQiOiIyY2Y5MGI1Mi05ZGE1LTRlZjEtYWNhMy1mMDA5ZTBhZTQ1OGUiLCJpYXQiOjE2ODk1MzEzMjEsImV4cCI6MTY4OTUzNDkyMX0.rbzshOLTcqzfV81WEQIIFYKd8gS9ZorhpEhQVVMbm7s"

// "eyJlbWFpbCI6IkFkcnVpbG9pbkB5YWhvby5jb20iLCJfaWQiOiJmOWJjM2M1Mi1mZGMyLTQwMWUtODZkMS0zMjUyMzFmNmYyYzYiLCJpYXQiOjE2ODk1MzI0MzYsImV4cCI6MTY4OTUzNjAzNn0.uLDJxUsh9mAwaCWikL_IZ6BSjbo6dR2dg2-11U2bgME"

//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFkcnVpbG9pbkB5YWhvby5jb20iLCJfaWQiOiJmOWJjM2M1Mi1mZGMyLTQwMWUtODZkMS0zMjUyMzFmNmYyYzYiLCJpYXQiOjE2ODk1MzI0MzYsImV4cCI6MTY4OTUzNjAzNn0.6Lw93GhUNHVNXCdkUpHE86fSXeLfsMgv9uPLNmuO5Tg",


//eyJhbGciOiJIUzI1NiJ9.e30.1-VbugJ-kdS3p3FNE9MaL8AneTm59yEmwwwUgDGRkz0
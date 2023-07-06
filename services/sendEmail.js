require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (to, subject, text)=>{
  const msg = {
    to: to, // Change to your recipient
    from: 'test@example.com', // Change to your verified sender
    subject: subject,
    text: text,
  };
  sgMail
  .send(msg)
  .then(() => {
    console.log('Email Sent Successfully')
  })
  .catch((error) => {
    console.error("Can't send at the moment", error)
  });
};


module.exports = {
                    sendEmail
};

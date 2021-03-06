const nodemailer = require('nodemailer');
const mail = require('./template2');

const accountCreationMail = function (User) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'campushappiness2@gmail.com',
      pass: 'campusbonheur',
    },
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"Campus happyness team" <campushapiness2@gmail.com>', // sender address
    to: User.email, // list of receivers
    subject: `Votre nouveau compte CampusHappyness, ${User.firstName}?`, // Subject line
    html: mail(User),
    text: `Link: http://localhost:3000/login`,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Account message sent: %s', info.messageId);
  });
};
module.exports = accountCreationMail;

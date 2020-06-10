require('dotenv').config();

const { createTransport } = require('nodemailer');

function SendMail(RecipientEmail, messageBody, subject = 'Welcome Email.') {
  let transporter = createTransport({
    host: 'smtp.googlemail.com', // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
    auth: {
      user: process.env.GMAIL_USERNAME, //Gmail username
      pass: process.env.GMAIL_PASSWORD, // Gmail password
    },
  });

  let fromMessage = `LibSol<${process.env.GMAIL_USERNAME}>`;

  let mailOptions = {
    from: fromMessage,
    to: RecipientEmail,
    // Recipient email address. Multiple emails can send separated by commas
    subject: subject,
    html: messageBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    else console.log(`Message sent: ${info.messageId}`);
  });
}

module.exports = SendMail;

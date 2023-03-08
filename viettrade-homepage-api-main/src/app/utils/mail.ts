const nodemailer = require('nodemailer');

export const sendMail = (to: string, subject: string, content: any) => {
  return new Promise((resolve) => {
    const smtpTransport = nodemailer.createTransport({
      service: process.env.MAIL_MAILER,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const mail = {
      from: 'viettrade',
      to: to,
      subject: subject,
      html: content
    };
    smtpTransport.sendMail(mail, function(error: any) {
      if (error) {
        console.log(error, 'error');
      }
      smtpTransport.close();
      resolve(null);
    });
  });
};

export const contentEmail = () => {
  ``;
};

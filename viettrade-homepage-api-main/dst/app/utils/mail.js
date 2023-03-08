"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentEmail = exports.sendMail = void 0;
const nodemailer = require('nodemailer');
const sendMail = (to, subject, content) => {
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
        smtpTransport.sendMail(mail, function (error) {
            if (error) {
                console.log(error, 'error');
            }
            smtpTransport.close();
            resolve(null);
        });
    });
};
exports.sendMail = sendMail;
const contentEmail = () => {
    ``;
};
exports.contentEmail = contentEmail;
//# sourceMappingURL=mail.js.map
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.BOT_EMAIL,
        pass: process.env.BOT_PASSWORD
    }
});

function  registrationNotificationByEmail(email, code) {

    const mailOptions = {
        from: process.env.BOT_EMAIL,
        to: email,
        subject: 'Greetings from Node.js!',
        text: 'Letter for registration',
        html: '<h1>Привіт!</h1><p>Це твій <b>код</b> для реєстрації.</p> ' +
            '<p> Код: <b>' + code + '</b></p>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error:', error);
        }
        console.log('The letter has been sent:', info.response);
    });

}

module.exports = {registrationNotificationByEmail};
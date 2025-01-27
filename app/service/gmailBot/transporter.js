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

function  registationMessageInEmail(email,code) {

    const mailOptions = {
        from: process.env.BOT_EMAIL,
        to: email,
        subject: 'Привіт від Node.js!',
        text: 'Лист для реєстрації',
        html: '<h1>Привіт!</h1><p>Це твій <b>код</b> для реєстрації.</p> ' +
            '<p> Код: <b>' + code + '</b></p>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Помилка:', error);
        }
        console.log('Лист надіслано:', info.response);
    });

}



module.exports = {registationMessageInEmail};
const nodemailer = require("nodemailer");

// This service will send invoice through Email
// using nodemailer library
const HOST = 'smtp.gmail.com';
const PORT = 465;
const SECURE = true;
const USER = 'adisazhar123@gmail.com';
const PASS = 'SKateboard123';

var ejs = require('ejs'),
fs = require('fs');


module.exports.SendEmail = async (invoice, items) => {
      
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: HOST,
            port: PORT,
            secure: SECURE, // true for 465, false for other ports
            auth: {
            user: USER, // generated ethereal user
            pass: PASS // generated ethereal password
            }
        });

        let subject;
        if(invoice.invoice_status == 'paid') {
            subject = 'Paid Invoice from New Look'
        } else {
            subject = 'Requesting Payment from New Look'
        }

        file = fs.readFileSync(__dirname + '/../../views/layouts/layout.invoice.ejs', 'ascii');

        console.log(items);

        rendered = ejs.render(file, {
          invoice, items
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"New Look Invoice" <adisazhar123@gmail.com>', // sender address
            to: invoice.client_email, // list of receivers
            subject: subject, // Subject line
            text: rendered, // plain text body
            html: rendered // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

};
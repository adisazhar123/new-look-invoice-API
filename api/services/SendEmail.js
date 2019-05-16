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


module.exports.SendEmail = async (invoice, items, user) => {
      
        let testAccount = await nodemailer.createTestAccount();
        let myUser = user[0];


        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: HOST,
            port: PORT,
            secure: SECURE, // true for 465, false for other ports
            auth: {
              user: USER,
              pass: PASS
            }
        });

        let subject, file;

        if(invoice.invoice_status == 'paid') {
            subject = 'Paid Invoice from New Look';
          if (invoice.theme == 'Cyan') {
            file = fs.readFileSync(__dirname + '/../../views/layouts/cyan/layout.invoice.ejs', 'ascii');
          }
          else if (invoice.theme == 'Teal') {
            file = fs.readFileSync(__dirname + '/../../views/layouts/teal/layout.invoice.ejs', 'ascii');
          }
          else if (invoice.theme == 'Magenta') {
            console.log('disini');
            file = fs.readFileSync(__dirname + '/../../views/layouts/magenta/layout.invoice.ejs', 'ascii');
          }
        } else {
            subject = 'Requesting Payment from New Look';
            if (invoice.theme == 'Cyan') {
              file = fs.readFileSync(__dirname + '/../../views/layouts/cyan/layout.unpaid-invoice.ejs', 'ascii');
            }
            else if (invoice.theme == 'Teal') {
              file = fs.readFileSync(__dirname + '/../../views/layouts/teal/layout.unpaid-invoice.ejs', 'ascii');
            }
            else if (invoice.theme == 'Magenta') {
              file = fs.readFileSync(__dirname + '/../../views/layouts/magenta/layout.unpaid-invoice.ejs', 'ascii');
            }
        }

        console.log(items);

        let rendered = ejs.render(file, {
          invoice, items, user: myUser, formatRupiah: (angka) => {
            var rupiah = '';
            var angkarev = angka.toString().split('').reverse().join('');
            for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
            return rupiah.split('',rupiah.length-1).reverse().join('');
          }
        });

        let info;

        try {
            info = await transporter.sendMail({
                from: '"New Look Invoice" <adisazhar123@gmail.com>', // sender address
                to: invoice.client_email, // list of receivers
                subject: subject, // Subject line
                text: rendered, // plain text body
                html: rendered // html body
            });

        } catch (error) {
            console.log(error);
            return;
        }
        // send mail with defined transport object

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

};
